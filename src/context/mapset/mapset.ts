import { derived, Readable, writable } from "src/context/stores";
import { Mapset, Beatmap, parseMapset, BeatmapLayer } from "src/io";
import { downloadMapset as dl, readMapset, exportMapset } from "src/io";
import { floorToMultiple } from "src/util/numbers";
import { createTimingStore, Timing } from "./timing";
import { BeatmapAudioStore, createBeatmapAudioStore } from "./audio";
import { BeatmapObjectWithCombo, createBeatmapObjectStore } from "./objects";


export interface MapsetStore {
  mapset: Readable<Mapset | undefined>;
  beatmap: Readable<Beatmap | undefined>;
  layer: Readable<BeatmapLayer | undefined>;
  time: Readable<number>;
  timeFormatted: Readable<string>;
  scale: Readable<number>;
  zoom: Readable<number>;
  timing: Readable<Timing>;
  audio: BeatmapAudioStore;
  objects: Readable<BeatmapObjectWithCombo[]>;

  goto(time: number, snap?: boolean): void;
  loadMapset(mapset: string | Blob | File | Mapset, beatmap?: string | number): Promise<void>;
  selectBeatmap(beatmap?: Beatmap | string | number, resetTime?: boolean): Promise<void>;
  selectLayer(layer?: BeatmapLayer): void;
  toggleLayerVisible(layer: BeatmapLayer): void;
  downloadMapset(): void;
  destroy(): void;
}


export function createMapsetStore(): MapsetStore {
  const $mapset = writable<Mapset | undefined>();
  const $beatmap = writable<Beatmap | undefined>();
  const $layer = writable<BeatmapLayer | undefined>();
  const $time = writable(0);
  const $scale = writable(3);
  const $zoom = writable(4);

  const $timing = createTimingStore($beatmap, $time, $scale);
  const $audio = createBeatmapAudioStore($mapset, $beatmap, $time);
  const $objects = createBeatmapObjectStore($beatmap);
  const $timeFormatted = derived([$time], ([time]) => {
    const ms = Math.floor(time % 1000);
    time = Math.floor(time / 1000);
    const s = time % 60;
    time = Math.floor(time / 60);
    const m = time % 60;
    const h = Math.floor(time / 60);
    if (h !== 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    else return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
  })

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

  function selectLayer(layer?: BeatmapLayer) {
    $layer.set(layer);
  }

  function toggleLayerVisible(layer: BeatmapLayer | string) {
    const beatmap = $beatmap.get();
    const layers = beatmap.layers;
    const index = layers.findIndex(l => l.id === (typeof layer === "string" ? layer : layer.id));
    if (index === -1) return;
    layers[index].visible = !layers[index].visible;
    $beatmap.set({ ...beatmap, layers: [...layers] });
  }

  async function downloadMapset() {
    await exportMapset($mapset.get());
  }

  function goto(time: number, snap?: boolean) {
    if (snap) {
      const { beatLength, scale, offset } = $timing.get()
      time = Math.floor(floorToMultiple(time, beatLength / scale, offset));
    }
    $time.set(time);
    $audio.skipTo(time);
  }


  function destroy() {
    $timing.destroy();
    $audio.destroy();
    $timeFormatted.destroy();
  }

  return (window as any).mapstore = {
    mapset: $mapset,
    beatmap: $beatmap,
    time: $time,
    scale: $scale,
    zoom: $zoom,
    layer: $layer,
    timing: $timing,
    audio: $audio,
    objects: $objects,
    timeFormatted: $timeFormatted,

    goto,
    loadMapset,
    selectBeatmap,
    selectLayer,
    toggleLayerVisible,
    downloadMapset,
    destroy,
  };
}

