import { convertToOsuFile } from "../export/serializer/main";
import { ParsedBeatmap, ParsedHitObject } from "../parse/types";
import { calculateStarRating } from "./calculator/index";

let beatmapsCache: BeatmapSRCache[] = [];

export function saveSRCache(parsedBeatmap: ParsedBeatmap): number {
  const rawBeatmap = convertToOsuFile(parsedBeatmap);

  const starRating = parseFloat(calculateStarRating(rawBeatmap)["nomod"].toFixed(2));

  saveBeatmapToCache(parsedBeatmap, starRating);

  return starRating;
}

function saveBeatmapToCache(parsedBeatmap: ParsedBeatmap, starRating: number): void {
  let beatmapCacheObject = {
    BeatmapSetID: parsedBeatmap.Metadata.BeatmapSetID,
    Version: parsedBeatmap.Metadata.Version,
    HitObjects: parsedBeatmap.HitObjects,
    StarRating: starRating

  } as BeatmapSRCache;

  beatmapsCache.push(beatmapCacheObject);
}

export function getCachedSR(): BeatmapSRCache[] {
  return beatmapsCache;
}

export function flushCache(): void {
  beatmapsCache = []
}


export interface BeatmapSRCache {
  BeatmapSetID: number;
  Version: string;
  HitObjects: ParsedHitObject[]
  StarRating: number;
}
