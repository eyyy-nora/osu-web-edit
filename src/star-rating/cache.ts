import { calculateStarRating } from "./calculator/index";
import { BeatmapObject } from "../../src/io/types/beatmap/objects/object";
import { Beatmap } from "../../src/io/types/beatmap/beatmap";
import { serializeBeatmap } from "../../src/io/serializer/beatmap";

const NUMBERS_AFTER_DOT = 2;

let starRatingCache: BeatmapStarRating[] = [];

export async function cacheStarRating(parsedBeatmap: Beatmap): Promise<number> {
  const rawBeatmap = await serializeBeatmap(parsedBeatmap);

  const starRating = parseFloat(calculateStarRating(rawBeatmap)["nomod"].toFixed(NUMBERS_AFTER_DOT));

  saveToCache(parsedBeatmap, starRating);

  return starRating;
}

function saveToCache(parsedBeatmap: Beatmap, starRating: number): void {
  let beatmapCacheEntry: BeatmapStarRating = {

    beatmapSetId: parsedBeatmap.metadata.beatmapSetID,
    version: parsedBeatmap.metadata.version,
    objects: parsedBeatmap.objects,
    starRating: starRating

  };

  starRatingCache.push(beatmapCacheEntry);
}

export interface BeatmapStarRating {
  beatmapSetId: number;
  version: string;
  objects: BeatmapObject[];
  starRating: number;
}

export function getCachedStarRatings(): BeatmapStarRating[] {
  return starRatingCache;
}

export function flushCache(): void {
  starRatingCache = []
}
