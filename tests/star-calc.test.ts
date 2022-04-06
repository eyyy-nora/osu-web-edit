import { parseOsuFile } from "../src/parse/parse-osu-file";
import fs from "fs";
import { computeStarRating } from "../src/star-rating/methods";
import { flushCache, getCachedStarRating } from "../src/star-rating/cache";

const dotOsuData = fs.readFileSync(__dirname + "/assets/testfile.osu");
const dotOsuDataAlt = fs.readFileSync(__dirname + "/assets/ladedade.osu");

const parsedDotOsu = parseOsuFile(dotOsuData.toString())
const parsedDotOsuAlt = parseOsuFile(dotOsuDataAlt.toString())


test('StarRating Calculation', () => {
  let beatmapStarRating = computeStarRating(parsedDotOsu);

  expect(beatmapStarRating).toMatchSnapshot();

  flushCache();
});

test('StarRating Cache: Cache should be written properly', () => {
  let beatmapStarRating = computeStarRating(parsedDotOsu);

  let cachedBeatmaps = getCachedStarRating();

  expect(cachedBeatmaps.length).toBe(1);

  expect(cachedBeatmaps[0].StarRating).toBe(beatmapStarRating);
  expect(cachedBeatmaps[0].BeatmapSetID).toBe(parsedDotOsu.Metadata.BeatmapSetID);
  expect(cachedBeatmaps[0].Version).toBe(parsedDotOsu.Metadata.Version);

  flushCache();
});

test('StarRating Cache: Cache should not be written when the same beatmap is computed twice', () => {
  computeStarRating(parsedDotOsu);
  let beatmapStarRating = computeStarRating(parsedDotOsu);

  let cachedBeatmaps = getCachedStarRating();

  expect(cachedBeatmaps.length).toBe(1);
  expect(cachedBeatmaps[0].StarRating).toBe(beatmapStarRating);

  flushCache();
});

test('StarRating Cache: If beatmap is not found in a cache already filled with other maps', () => {
  computeStarRating(parsedDotOsuAlt);
  let beatmapStarRating = computeStarRating(parsedDotOsu);

  let cachedBeatmaps = getCachedStarRating();

  expect(cachedBeatmaps.length).toBe(2);
  expect(cachedBeatmaps[1].StarRating).toBe(beatmapStarRating);

  flushCache();
})
