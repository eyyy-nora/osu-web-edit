import {
  downloadMapset,
  readMapset,
  parseMapset
} from "../parse/parse-osu-file";
import { everyFrame } from "../util/timing";
import { ParsedBeatmap, ParsedMapSet } from "../parse/types";
import { getContext, setContext } from "svelte";
import { writable, Readable, Writable } from "svelte/store";



export const MAPSET_CONTEXT = {};

export interface MapsetContext {
  mapset: Readable<ParsedMapSet | undefined>;
  beatmap: Readable<ParsedBeatmap | undefined>;
  time: Writable<number>;
  playbackSpeed: Writable<number>;


  loadMapset(mapset: ParsedMapSet | File | Blob | string, beatmap?: string | number): Promise<void>;
  selectBeatmap(beatmap: ParsedBeatmap | string | number): Promise<void>;
  goto(time: number): void;

  togglePlayback(): Promise<void>;
}

export function getMapsetContext() {
  return getContext<MapsetContext>(MAPSET_CONTEXT);
}

export function createMapsetContext() {
  const $mapset = writable<ParsedMapSet | undefined>();
  const $beatmap = writable<ParsedBeatmap | undefined>();
  const $time = writable<number>(0);
  const $playbackSpeed = writable<number>(1);

  let mapset: ParsedMapSet | undefined = undefined;
  const unlinkMapset = $mapset.subscribe(value => mapset = value);

  let time: number = 0;
  const unlinkTime = $time.subscribe(value => time = value);

  let audio: HTMLAudioElement | undefined = undefined, destroyAudio: (() => void) | undefined = undefined;

  async function loadMapset(mapset: ParsedMapSet | File | Blob | string, beatmap?: string | number): Promise<void> {
    if (typeof mapset === "string") mapset = await downloadMapset(mapset);
    if (mapset instanceof File) mapset = await readMapset(mapset);
    if (mapset instanceof Blob) mapset = await parseMapset(mapset);
    $mapset.set(mapset);
    await selectBeatmap(beatmap);
  }

  async function selectBeatmap(beatmap: ParsedBeatmap | string | number): Promise<void> {
    if (typeof beatmap === "string" || typeof beatmap === "number")
      beatmap = mapset.difficulties.find(version => {
        const { BeatmapID, Version } = version.Metadata;
        return BeatmapID?.toString(10) === beatmap || Version === beatmap;
      }) ?? mapset.difficulties[0];
    $beatmap.set(beatmap);
    $time.set(beatmap.TimingPoints[0].time);
    if (destroyAudio) destroyAudio();
    [audio, destroyAudio] = createAudio(mapset.files[beatmap.General.AudioFilename]);
  }

  function syncTimeToAudio() {
    $time.set(audio.currentTime * 1000);
  }

  function syncAudioToTime() {
    if (audio) audio.currentTime = time / 1000;
  }

  let cancelPlayback: (() => void) | undefined = undefined;
  async function togglePlayback() {
    if (audio.paused) {
      syncAudioToTime();
      cancelPlayback = everyFrame(syncTimeToAudio);
      await audio.play();
    } else {
      if (cancelPlayback) {
        cancelPlayback();
        cancelPlayback = undefined;
      }
      await audio.pause();
      syncTimeToAudio();
    }
  }

  function goto(t: number) {
    $time.set(time = t);
    syncAudioToTime()
  }

  const context: MapsetContext = {
    mapset: $mapset,
    beatmap: $beatmap,
    time: $time,
    playbackSpeed: $playbackSpeed,

    loadMapset,
    selectBeatmap,
    togglePlayback,
    goto,
  };

  setContext<MapsetContext>(MAPSET_CONTEXT, context);

  return [context, () => {
    unlinkMapset();
    unlinkTime();
    cancelPlayback?.();
    destroyAudio?.();
  }];
}

function createAudio(file: Blob | File): [HTMLAudioElement, () => void] {
  const audio = document.createElement("audio");
  const url = audio.src = URL.createObjectURL(file);
  audio.volume = .1;
  return [audio, () => {
    document.body.removeChild(audio);
    URL.revokeObjectURL(url);
  }];
}
