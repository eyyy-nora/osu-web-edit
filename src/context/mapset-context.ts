import {
  downloadMapset,
  readMapset,
  parseMapset
} from "../parse/parse-osu-file";
import { everyFrame } from "../util/timing";
import { ParsedBeatmap, ParsedMapSet, ParsedTimingPoint } from "../parse/types";
import { getContext, setContext } from "svelte";
import { writable, Readable, Writable, derived } from "svelte/store";
import JSZip from "jszip";


export interface TimingMeta {
  beatLength: number;
  offset: number;
  meter: number;
}

export const MAPSET_CONTEXT = {};

export type MapsetWithFolder = {
  mapSet: ParsedMapSet;
  mapFolder: JSZip;
};

export interface MapsetContext {
  mapset: Readable<ParsedMapSet | undefined>;
  beatmap: Readable<ParsedBeatmap | undefined>;
  folder: Readable<JSZip | undefined>;
  time: Writable<number>;
  playbackSpeed: Writable<number>;

  timingPoint: Readable<ParsedTimingPoint | undefined>;
  timing: Readable<TimingMeta>;

  loadMapset(mapset: MapsetWithFolder | File | Blob | string, beatmap?: string | number): Promise<void>;
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
  const $folder = writable<JSZip | undefined>();
  const $time = writable<number>(0);
  const $playbackSpeed = writable<number>(1);

  const $timingPoint = derived([$beatmap, $time], ([beatmap, time]) => {
    const timingPoints = beatmap?.TimingPoints?.filter(it => !it.inherited) ?? [];
    if (!timingPoints.length) return;
    const firstBiggerIndex = timingPoints.findIndex(point => point.time > time);
    if (firstBiggerIndex === -1) return timingPoints[timingPoints.length - 1];
    if (firstBiggerIndex === 0) return timingPoints[0];
    return timingPoints[firstBiggerIndex - 1];
  });

  const $timing = derived([$timingPoint], ([timingPoint]) => {
    const { beatLength = 200, time: offset = 0, meter = 4 } = timingPoint ?? {};
    return { beatLength, offset, meter };
  })

  let mapset: ParsedMapSet | undefined = undefined;
  const unlinkMapset = $mapset.subscribe(value => mapset = value);

  let folder: JSZip | undefined = undefined;
  const unlinkFolder = $folder.subscribe(value => folder = value);

  let time: number = 0;
  const unlinkTime = $time.subscribe(value => time = value);

  let audio: HTMLAudioElement | undefined = undefined, destroyAudio: (() => void) | undefined = undefined;

  async function loadMapset(mapset: MapsetWithFolder | File | Blob | string, beatmap?: string | number): Promise<void> {
    if (typeof mapset === "string") mapset = await downloadMapset(mapset);
    if (mapset instanceof File) mapset = await readMapset(mapset);
    if (mapset instanceof Blob) mapset = await parseMapset(mapset)

    $mapset.set(mapset.mapSet);
    $folder.set(mapset.mapFolder);

    await selectBeatmap(beatmap);
  }

  async function selectBeatmap(beatmap: ParsedBeatmap | string | number): Promise<void> {
    if (typeof beatmap === "string" || typeof beatmap === "number")
      beatmap = mapset.difficulties.find(version => {
        const { BeatmapID, Version } = version.Metadata;
        return BeatmapID?.toString(10) === beatmap || Version === beatmap;
      });
    beatmap ??= mapset.difficulties[0];
    $beatmap.set(beatmap);
    $time.set(beatmap?.TimingPoints[0].time ?? 0);
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
    if (!audio) return;
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
    folder: $folder,
    time: $time,
    playbackSpeed: $playbackSpeed,
    timingPoint: $timingPoint,
    timing: $timing,

    loadMapset,
    selectBeatmap,
    togglePlayback,
    goto,
  };

  setContext<MapsetContext>(MAPSET_CONTEXT, context);

  return [context, () => {
    unlinkMapset();
    unlinkFolder();
    unlinkTime();
    cancelPlayback?.();
    destroyAudio?.();
  }];
}

function createAudio(file: Blob | File): [HTMLAudioElement, () => void] {
  const audio = document.createElement("audio");
  const url = audio.src = URL.createObjectURL(file);
  audio.volume = .1;
  Object.assign(audio.style, {
    position: "absolute",
    top: "-1000000px",
    left: "-1000000px",
    opacity: "0",
    width: "1px",
    height: "1px",
    tabIndex: "-1",
  });
  document.body.appendChild(audio);
  return [audio, () => {
    document.body.removeChild(audio);
    URL.revokeObjectURL(url);
  }];
}
