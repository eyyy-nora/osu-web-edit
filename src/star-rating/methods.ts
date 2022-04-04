import { ParsedBeatmap } from "../parse/types";
import { BeatmapSRCache, saveSRCache, getCachedSR } from "./cache";

export function computeStarRating(parsedBeatmap: ParsedBeatmap): number {
  let beatmapsCache = getCachedSR();

  if (beatmapsCache.length > 0) {
    for (let i = 0; i < beatmapsCache.length; i++) {
      let cachedBeatmap = beatmapsCache[i];

      if (beatmapsAreEqual(cachedBeatmap, parsedBeatmap))
        return cachedBeatmap.StarRating;

      else if (isLastLoopIteration(i, beatmapsCache.length))
        return saveSRCache(parsedBeatmap);

    }
  } else {
    return saveSRCache(parsedBeatmap);
  }

}


function isLastLoopIteration(iterator: number, length: number): boolean {
  return iterator === (length - 1)
}

function beatmapsAreEqual(beatmapInCache: BeatmapSRCache, checkedBeatmap: ParsedBeatmap ): boolean {
  return (
    beatmapInCache.BeatmapSetID === checkedBeatmap.Metadata.BeatmapSetID &&
    beatmapInCache.Version === checkedBeatmap.Metadata.Version &&
    beatmapInCache.HitObjects === checkedBeatmap.HitObjects
  );
}

