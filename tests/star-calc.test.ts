import { getStarRating } from "../src/star-rating/methods";
import { flushCache, getCachedStars } from "../src/star-rating/cache";
import { getParsedBeatmap } from "./utils/beatmap";


test('Star rating calculation', async () => {
  const beatmapsToTest = [
    await getParsedBeatmap("testfile"),
    await getParsedBeatmap("centipede"),
    await getParsedBeatmap("ladedade"),
  ];

  for (const beatmap of beatmapsToTest) {
    let starRating = await getStarRating(beatmap);

    expect(starRating).toMatchSnapshot();
  }

  flushCache();
});


// Cache related tests

let testfile;
let ladedade;

(async function loadVariables() {
  testfile = await getParsedBeatmap("testfile");
  ladedade = await getParsedBeatmap("ladedade");
})();

test('Star rating cache: First entry on the cache', async () => {

  let beatmapStarRating = await getStarRating(testfile);

  let cachedBeatmaps = getCachedStars();

  expect(cachedBeatmaps.length).toBe(1);

  expect(cachedBeatmaps[0].starRating).toBe(beatmapStarRating);
  expect(cachedBeatmaps[0].beatmapSetId).toBe(testfile.metadata.beatmapSetID);
  expect(cachedBeatmaps[0].version).toBe(testfile.metadata.version);

  flushCache();
});

test('Star rating cache: Cache should not repeat', async () => {

  await getStarRating(testfile);
  let beatmapStarRating = await getStarRating(testfile);

  let cachedStarRating = getCachedStars();

  expect(cachedStarRating.length).toBe(1);
  expect(cachedStarRating[0].starRating).toBe(beatmapStarRating);

  flushCache();
});

test('Star rating cache: New entry on a already filled cache', async () => {

  await getStarRating(ladedade);
  let beatmapStarRating = await getStarRating(testfile);

  let cachedBeatmaps = getCachedStars();

  expect(cachedBeatmaps.length).toBe(2);
  expect(cachedBeatmaps[1].starRating).toBe(beatmapStarRating);

  flushCache();
});
