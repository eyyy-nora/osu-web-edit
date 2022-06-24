import { Beatmap } from "../../src/io/types/beatmap/beatmap";
import { BeatmapStarRating, cacheStarRating, getCachedStarRatings } from "./cache";

export async function computeStarRating(parsedBeatmap: Beatmap) {
  let starRatingCache = getCachedStarRatings();
  let cacheLength = starRatingCache.length;

  if (cacheLength <= 0) return await cacheStarRating(parsedBeatmap);

  for (let posi = 0; posi < cacheLength; posi++) {
    let beatmapInCache = starRatingCache[posi];

    if (beatmapsAreEqual(beatmapInCache, parsedBeatmap))
      return beatmapInCache.starRating;

    else if (isLastLoopIteration(posi, cacheLength))
      return await cacheStarRating(parsedBeatmap);
  }
}

function beatmapsAreEqual(beatmapInCache: BeatmapStarRating, checkedBeatmap: Beatmap): boolean {
  return (
    beatmapInCache.beatmapSetId === checkedBeatmap.metadata.beatmapSetID &&
    beatmapInCache.version === checkedBeatmap.metadata.version &&
    beatmapInCache.objects === checkedBeatmap.objects
  );
}

function isLastLoopIteration(position: number, length: number): boolean {
  const END_OF_ARRAY = (length - 1);
  return position === END_OF_ARRAY;
}
