import { clientForTest } from "../utils/test-client";
import { fetchBeatmapMods } from "../../functions/osu/beatmap/main"

jest.setTimeout(30 * 1000);

test('Netlify function: Fetch beatmap mods/discussions', async () => {
  const testClient = clientForTest();

  const beatmapsToTest = [
    JSON.stringify(await fetchBeatmapMods(1, testClient)),
    JSON.stringify(await fetchBeatmapMods(1725839, testClient)),
  ];

  for (const beatmap of beatmapsToTest) {
    expect(beatmap).toMatchSnapshot();
  }

});
