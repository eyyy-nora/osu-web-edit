import { ParsedBeatmap, ParsedMapSet } from "../parse/types";
import { onDestroy, setContext } from "svelte";
import { writable, Readable, Writable } from "svelte/store";



export const MAPSET_CONTEXT = {};

export interface MapsetContext {
  mapset: Readable<ParsedMapSet | undefined>;
  beatmap: Readable<ParsedBeatmap | undefined>;
  time: Writable<number>;

  loadMapSet(mapset: ParsedMapSet, beatmap?: string | number): Promise<void>;
  selectBeatmap(beatmap: ParsedBeatmap | string | number): Promise<void>;
}

function createMapsetContext() {
  const $mapset = writable<ParsedMapSet | undefined>();
  const $beatmap = writable<ParsedBeatmap | undefined>();
  const $time = writable<number>(0);

  let mapset: ParsedMapSet | undefined = undefined;
  onDestroy($mapset.subscribe(value => mapset = value));

  async function loadMapSet(mapset: ParsedMapSet, beatmap?: string | number): Promise<void> {
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
  }

  setContext<MapsetContext>(MAPSET_CONTEXT, {
    mapset: $mapset,
    beatmap: $beatmap,
    time: $time,

    loadMapSet,
    selectBeatmap,
  });
}


