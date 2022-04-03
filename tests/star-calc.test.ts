import { parseOsuFile } from "../src/parse/parse-osu-file";
import fs from "fs";
import { computeStarRating } from "../src/star-rating/methods";
import { flushCache, getCachedSR } from "../src/star-rating/cache";

const dotOsuData = fs.readFileSync(__dirname + "/assets/testfile.osu");
const dotOsuDataAlt = fs.readFileSync(__dirname + "/assets/testfile-alt.osu");

const parsedDotOsu = parseOsuFile(dotOsuData.toString())
const parsedDotOsuAlt = parseOsuFile(dotOsuDataAlt.toString())


test('StarRating Calculation', () => {
  let beatmapStarRating = computeStarRating(dotOsuData.toString(), parsedDotOsu);

  expect(beatmapStarRating).toMatchSnapshot();

  flushCache();
});

test('StarRating Cache: Cache being written', () => {
  let beatmapStarRating = computeStarRating(dotOsuData.toString(), parsedDotOsu);

  let cachedBeatmaps = getCachedSR();

  expect(cachedBeatmaps.length).toBe(1);

  expect(cachedBeatmaps[0].StarRating).toBe(beatmapStarRating);
  expect(cachedBeatmaps[0].BeatmapSetID).toBe(parsedDotOsu.Metadata.BeatmapSetID);
  expect(cachedBeatmaps[0].Version).toBe(parsedDotOsu.Metadata.Version);

  flushCache();
});

test('StarRating Cache: Cache not being written when the same beatmap is computed twice', () => {
  computeStarRating(dotOsuData.toString(), parsedDotOsu);
  let beatmapStarRating = computeStarRating(dotOsuData.toString(), parsedDotOsu);

  let cachedBeatmaps = getCachedSR();

  expect(cachedBeatmaps.length).toBe(1);
  expect(cachedBeatmaps[0].StarRating).toBe(beatmapStarRating);

  flushCache();
});

test('StarRating Cache: Beatmap not being found in a cache already filled', () => {
  computeStarRating(dotOsuDataAlt.toString(), parsedDotOsuAlt);
  let beatmapStarRating = computeStarRating(dotOsuData.toString(), parsedDotOsu);

  let cachedBeatmaps = getCachedSR();

  expect(cachedBeatmaps.length).toBe(2);
  expect(cachedBeatmaps[1].StarRating).toBe(beatmapStarRating);

  flushCache();
})
