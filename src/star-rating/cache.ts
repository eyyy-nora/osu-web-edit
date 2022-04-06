import { convertToOsuFile } from "../export/serializer/main";
import { ParsedBeatmap, ParsedHitObject } from "../parse/types";
import { calculateStarRating } from "./calculator/index";

const NUMBERS_AFTER_DOT = 2;

let StarRatingCache: BeatmapStarRating[] = [];

export function cacheStarRating(parsedBeatmap: ParsedBeatmap): number {
  const rawBeatmap = convertToOsuFile(parsedBeatmap);

  const starRating = parseFloat(calculateStarRating(rawBeatmap)["nomod"].toFixed(NUMBERS_AFTER_DOT));

  saveToCache(parsedBeatmap, starRating);

  return starRating;
}

function saveToCache(parsedBeatmap: ParsedBeatmap, starRating: number): void {
  let beatmapCacheEntry: BeatmapStarRating = {

    BeatmapSetID: parsedBeatmap.Metadata.BeatmapSetID,
    Version: parsedBeatmap.Metadata.Version,
    HitObjects: parsedBeatmap.HitObjects,
    StarRating: starRating

  };

  StarRatingCache.push(beatmapCacheEntry);
}

export interface BeatmapStarRating {
  BeatmapSetID: number;
  Version: string;
  HitObjects: ParsedHitObject[]
  StarRating: number;
}

export function getCachedStarRating(): BeatmapStarRating[] {
  return StarRatingCache;
}

export function flushCache(): void {
  StarRatingCache = []
}
