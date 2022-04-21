import { writable } from "src/context/stores";
import { Mapset, Beatmap, parseMapset } from "src/io";
import { downloadMapset as dl, readMapset, exportMapset } from "src/io";
import { createTimingStore } from "./timing";
import { createBeatmapAudioStore } from "./audio";
import { createBeatmapObjectStore } from "./objects";



export function createMapsetStore() {
  const $mapset = writable<Mapset | undefined>();
  const $beatmap = writable<Beatmap | undefined>();
  const $time = writable(0);

  const timing = createTimingStore($beatmap, $time);
  const audio = createBeatmapAudioStore($mapset, $beatmap, $time);
  const objects = createBeatmapObjectStore($beatmap);

  async function loadMapset(mapset: string | Blob | File | Mapset, beatmap?: string | number) {
    if (typeof mapset === "string") mapset = await dl(mapset);
    if (mapset instanceof File) mapset = await readMapset(mapset);
    if (mapset instanceof Blob) mapset = await parseMapset(mapset);

    $mapset.set(mapset as Mapset);

    await selectBeatmap(beatmap, true);
  }

  async function selectBeatmap(beatmap?: Beatmap | string | number, resetTime = false): Promise<void> {
    if (typeof beatmap === "string" || typeof beatmap === "number")
      beatmap = $mapset.get().beatmaps.find(({ metadata }) =>
        `${metadata.beatmapID}` === `${beatmap}` || metadata.version === `${beatmap}`
      );
    beatmap ??= $mapset.get().beatmaps[0];
    $beatmap.set(beatmap);
    if (resetTime) $time.set(beatmap.timingPoints[0].time);
  }

  async function downloadMapset() {
    await exportMapset($mapset.get());
  }

  function goto(time: number) {
    $time.set(time);
    audio.skipTo(time);
  }


  function destroy() {
    timing.destroy();
    audio.destroy();
  }

  return (window as any).mapstore = {
    mapset: $mapset,
    beatmap: $beatmap,
    time: $time,
    timing,
    audio,
    objects,

    goto,
    loadMapset,
    selectBeatmap,
    downloadMapset,
    destroy,
  };
}

