import { computeStarRating } from "../src/star-rating/methods";
import { flushCache, getCachedStarRatings } from "../src/star-rating/cache";
import { getBeatmap } from "./utils/beatmap";


test('Star rating calculation', async () => {
  const beatmapsToTest = [
    await getBeatmap("testfile"),
    await getBeatmap("centipede"),
    await getBeatmap("ladedade"),
  ];

  for (const beatmap of beatmapsToTest) {
    let starRating = await computeStarRating(beatmap);

    expect(starRating).toMatchSnapshot();
  }

  flushCache();
});


// Cache related tests

let testfile;
let ladedade;

(async function loadVariables() {
  testfile = await getBeatmap("testfile");
  ladedade = await getBeatmap("ladedade");
})();

test('Star rating cache: First entry on the cache', async () => {

  let beatmapStarRating = await computeStarRating(testfile);

  let cachedBeatmaps = getCachedStarRatings();

  expect(cachedBeatmaps.length).toBe(1);

  expect(cachedBeatmaps[0].starRating).toBe(beatmapStarRating);
  expect(cachedBeatmaps[0].beatmapSetId).toBe(testfile.metadata.beatmapSetID);
  expect(cachedBeatmaps[0].version).toBe(testfile.metadata.version);

  flushCache();
});

test('Star rating cache: Cache should not repeat', async () => {

  await computeStarRating(testfile);
  let beatmapStarRating = await computeStarRating(testfile);

  let cachedStarRating = getCachedStarRatings();

  expect(cachedStarRating.length).toBe(1);
  expect(cachedStarRating[0].starRating).toBe(beatmapStarRating);

  flushCache();
});

test('Star rating cache: New entry on a already filled cache', async () => {

  await computeStarRating(ladedade);
  let beatmapStarRating = await computeStarRating(testfile);

  let cachedBeatmaps = getCachedStarRatings();

  expect(cachedBeatmaps.length).toBe(2);
  expect(cachedBeatmaps[1].starRating).toBe(beatmapStarRating);

  flushCache();
});
