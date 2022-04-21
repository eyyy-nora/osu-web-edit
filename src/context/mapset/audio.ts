import { Readable, Writable, derived, writable } from "src/context/stores";
import { Beatmap, Mapset } from "src/io";
import { everyFrame } from "src/util/timing";


export function createBeatmapAudioStore(
  $mapset: Readable<Mapset>,
  $beatmap: Readable<Beatmap>,
  $time: Writable<number>,
) {
  let cancelPlaybackSync: (() => void) | void;

  const $playback = writable(1);

  let destroyFn: (() => void) | void;
  const $audio = derived([$mapset, $beatmap], async ([mapset, beatmap]) => {
    if (destroyFn) destroyFn = destroyFn();
    if (!mapset || !beatmap) return;
    const [audio, destroy] = loadAudio(await mapset.files[beatmap.general.audioFilename]());
    destroyFn = () => {
      if (cancelPlaybackSync) cancelPlaybackSync();
      if (!audio.paused) audio.pause();
      destroy();
    }
    return audio;
  });

  const destroyPlaybackRateHook = $playback.subscribe((rate) => {
    const audio = $audio.get();
    if (audio) audio.playbackRate = rate;
  });

  async function play() {
    const audio = $audio.get();
    if (!audio || !audio.paused) return;
    audio.currentTime = $time.get() / 1000;
    audio.playbackRate = $playback.get();
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
    if ($audio.get().paused) await play();
    else await pause();
  }

  function destroy() {
    $audio.destroy();
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
    delete audio.src;
    URL.revokeObjectURL(url);
  }

  return [audio, destroy];
}
