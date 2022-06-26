import { BeatmapStarRating, cacheStarRating, getCachedStars } from "./cache";
import { isEmpty, weAreInTheEndOfTheArray } from "../util/array";
import { Beatmap } from "../../src/io/types/beatmap/beatmap";

export async function getStarRating(beatmap: Beatmap) {

  let starRatingCache = getCachedStars();

  if (isEmpty(starRatingCache)) {

    return await cacheStarRating(beatmap);
  }

  for (const beatmapInCache of starRatingCache) {
    let currentPosition = starRatingCache.indexOf(beatmapInCache);

    if (beatmapsAreEqual(beatmapInCache, beatmap)) {

      return beatmapInCache.starRating;
    }

    if (weAreInTheEndOfTheArray(currentPosition, starRatingCache)) {

      return await cacheStarRating(beatmap);
    }
  }
}



function beatmapsAreEqual(beatmapInCache: BeatmapStarRating, checkedBeatmap: Beatmap) {
  return (
    beatmapInCache.beatmapSetId === checkedBeatmap.metadata.beatmapSetID &&
    beatmapInCache.version      === checkedBeatmap.metadata.version      &&
    beatmapInCache.objects      === checkedBeatmap.objects
  );
}
