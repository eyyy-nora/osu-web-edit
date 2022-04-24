import {
  Readable,
  Writable,
  derived,
  writable,
  Destroyable
} from "src/context/stores";
import { Beatmap, Mapset } from "src/io";
import { snowflake } from "src/util/snowflake";
import { everyFrame } from "src/util/timing";


export interface BeatmapAudioStore {
  audio: Readable<HTMLAudioElement>;
  playback: Writable<number>;
  play(): Promise<void>;
  pause(): Promise<void>;
  toggle(): Promise<void>;
  skipTo(time: number): void;
}

export function createBeatmapAudioStore(
  $mapset: Readable<Mapset>,
  $beatmap: Readable<Beatmap>,
  $time: Writable<number>,
): BeatmapAudioStore & Destroyable {
  let destroyFn: (() => void) | void;
  let cancelPlaybackSync: (() => void) | void;

  const $playback = writable(1);
  const $audio = writable<HTMLAudioElement>(undefined);

  let audioId = snowflake();

  $beatmap.subscribe(async beatmap => {
    if (cancelPlaybackSync) cancelPlaybackSync();
    if (destroyFn) destroyFn();
    $audio.set(undefined);
    if (!beatmap) return;
    const id = audioId = snowflake();
    const [audio, destroy] = loadAudio(await $mapset.get().files[beatmap.general.audioFilename]());
    if (id !== audioId) return destroy();
    $audio.set(audio);
    destroyFn = destroy;
  })

  const destroyPlaybackRateHook = $playback.subscribe((rate) => {
    const audio = $audio.get();
    if (audio) audio.playbackRate = rate;
  });

  async function play() {
    const audio = $audio.get();
    if (!audio || !audio.paused) return;
    audio.currentTime = $time.get() / 1000;
    audio.playbackRate = $playback.get();
    if (cancelPlaybackSync) cancelPlaybackSync = cancelPlaybackSync();
    cancelPlaybackSync = everyFrame(() => $time.set(audio.currentTime * 1000));
    await audio.play();
  }

  async function pause() {
    if (cancelPlaybackSync) cancelPlaybackSync = cancelPlaybackSync();
    const audio = $audio.get();
    if (!audio || audio.paused) return;
    await audio.pause();
    $time.set(audio.currentTime * 1000);
  }

  function skipTo(time: number) {
    const audio = $audio.get();
    if (audio) audio.currentTime = time / 1000;
  }

  async function toggle() {
    const audio = $audio.get();
    if (!audio) return;
    if (audio.paused) await play();
    else await pause();
  }

  function destroy() {
    destroyPlaybackRateHook();
    if (destroyFn) destroyFn();
    if (cancelPlaybackSync) cancelPlaybackSync();
  }

  return { playback: $playback, audio: $audio, play, pause, toggle, skipTo, destroy };
}


export function loadAudio(file: Blob, { volume = .1 }: { volume?: number } = {}): [HTMLAudioElement, () => void] {
  let audio: HTMLAudioElement = document.createElement("audio");
  const url = audio.src = URL.createObjectURL(file);
  audio.volume = volume;

  function destroy() {
    audio.volume = 0;
    audio.muted = true;
    if (!audio.paused) audio.pause();
    delete audio.src;
    URL.revokeObjectURL(url);
  }

  return [audio, destroy];
}
