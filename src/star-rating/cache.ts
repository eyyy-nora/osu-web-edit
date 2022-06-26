import { calculateStarRating } from "./calculator/index";
import { BeatmapObject } from "../../src/io/types/beatmap/objects/object";
import { Beatmap } from "../../src/io/types/beatmap/beatmap";
import { serializeBeatmap } from "../../src/io/serializer/beatmap";

let starRatingCache: BeatmapStarRating[] = [];

export async function cacheStarRating(beatmap: Beatmap): Promise<number> {
  const NUMBERS_AFTER_DOT = 2;


  const serializedMap = await serializeBeatmap(beatmap);

  const starRating = parseFloat(

    calculateStarRating(serializedMap)["nomod"].toFixed(NUMBERS_AFTER_DOT)

  );

  saveToCache(beatmap, starRating);

  return starRating;
}

function saveToCache(beatmap: Beatmap, starRating: number): void {
  let cacheEntry: BeatmapStarRating = {

    beatmapSetId: beatmap.metadata.beatmapSetID,
    version: beatmap.metadata.version,
    objects: beatmap.objects,
    starRating: starRating

  };

  starRatingCache.push(cacheEntry);
}

export interface BeatmapStarRating {
  beatmapSetId: number;
  version: string;
  objects: BeatmapObject[];
  starRating: number;
}

export function getCachedStars(): BeatmapStarRating[] {
  return starRatingCache;
}

export function flushCache(): void {
  starRatingCache = []
}
