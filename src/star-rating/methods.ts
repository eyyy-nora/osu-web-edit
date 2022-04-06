import { ParsedBeatmap } from "../parse/types";
import { BeatmapStarRating, cacheStarRating, getCachedStarRating } from "./cache";

export function computeStarRating(parsedBeatmap: ParsedBeatmap): number {
  let starRatingCache = getCachedStarRating();
  let cacheLength = starRatingCache.length;

  if (cacheLength <= 0) return cacheStarRating(parsedBeatmap);

  for (let posi = 0; posi < cacheLength; posi++) {
    let beatmapInCache = starRatingCache[posi];

    if (beatmapsAreEqual(beatmapInCache, parsedBeatmap)) return beatmapInCache.StarRating;

    else if (isLastLoopIteration(posi, cacheLength)) return cacheStarRating(parsedBeatmap);
  }
}

function beatmapsAreEqual(beatmapInCache: BeatmapStarRating, checkedBeatmap: ParsedBeatmap): boolean {
  return (
    beatmapInCache.BeatmapSetID === checkedBeatmap.Metadata.BeatmapSetID &&
    beatmapInCache.Version === checkedBeatmap.Metadata.Version &&
    beatmapInCache.HitObjects === checkedBeatmap.HitObjects
  );
}

function isLastLoopIteration(position: number, length: number): boolean {
  const END_OF_ARRAY = (length - 1);
  return position === END_OF_ARRAY;
}
