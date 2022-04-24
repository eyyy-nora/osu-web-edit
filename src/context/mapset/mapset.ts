import { Readable, writable } from "src/context/stores";
import { Mapset, Beatmap, parseMapset, BeatmapLayer } from "src/io";
import { downloadMapset as dl, readMapset, exportMapset } from "src/io";
import { createTimingStore, Timing } from "./timing";
import { BeatmapAudioStore, createBeatmapAudioStore } from "./audio";
import { BeatmapObjectWithCombo, createBeatmapObjectStore } from "./objects";


export interface MapsetStore {
  mapset: Readable<Mapset | undefined>;
  beatmap: Readable<Beatmap | undefined>;
  layer: Readable<BeatmapLayer | undefined>;
  visibleLayers: Readable<BeatmapLayer[]>;
  mainVisible: Readable<boolean>;
  time: Readable<number>;
  scale: Readable<number>;
  zoom: Readable<number>;
  timing: Readable<Timing>;
  audio: BeatmapAudioStore;
  objects: Readable<BeatmapObjectWithCombo[]>;

  goto(time: number): void;
  loadMapset(mapset: string | Blob | File | Mapset, beatmap?: string | number): Promise<void>;
  selectBeatmap(beatmap?: Beatmap | string | number, resetTime?: boolean): Promise<void>;
  selectLayer(layer?: BeatmapLayer): void;
  toggleLayerVisible(layer?: BeatmapLayer): void;
  downloadMapset(): void;
  destroy(): void;
}


export function createMapsetStore(): MapsetStore {
  const $mapset = writable<Mapset | undefined>();
  const $beatmap = writable<Beatmap | undefined>();
  const $layer = writable<BeatmapLayer | undefined>();
  const $visibleLayers = writable<BeatmapLayer[]>([]);
  const $mainVisible = writable(true);
  const $time = writable(0);
  const $scale = writable(3);
  const $zoom = writable(4);

  const $timing = createTimingStore($beatmap, $time, $scale);
  const $audio = createBeatmapAudioStore($mapset, $beatmap, $time);
  const $objects = createBeatmapObjectStore($beatmap, $visibleLayers, $mainVisible);

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
    $visibleLayers.set([]);
    if (resetTime) $time.set(beatmap.timingPoints[0].time);
  }

  function selectLayer(layer?: BeatmapLayer) {
    $layer.set(layer);
  }

  function toggleLayerVisible(layer?: BeatmapLayer) {
    if (!layer) return $mainVisible.update(it => !it);
    if (!$beatmap.get().layers.includes(layer)) return;

    const visible = $visibleLayers.get();
    if (visible.includes(layer)) $visibleLayers.set(visible.filter(it => it !== layer));
    else $visibleLayers.set([...visible, layer]);
  }

  async function downloadMapset() {
    await exportMapset($mapset.get());
  }

  function goto(time: number) {
    $time.set(time);
    $audio.skipTo(time);
  }


  function destroy() {
    $timing.destroy();
    $audio.destroy();
  }

  return (window as any).mapstore = {
    mapset: $mapset,
    beatmap: $beatmap,
    time: $time,
    scale: $scale,
    zoom: $zoom,
    visibleLayers: $visibleLayers,
    layer: $layer,
    mainVisible: $mainVisible,
    timing: $timing,
    audio: $audio,
    objects: $objects,

    goto,
    loadMapset,
    selectBeatmap,
    selectLayer,
    toggleLayerVisible,
    downloadMapset,
    destroy,
  };
}

