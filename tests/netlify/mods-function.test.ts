import { testClient } from "../utils/test-client";
import { fetchBeatmapMods } from "../../functions/osu/beatmap/main"

jest.setTimeout(30 * 1000);

test('Netlify function: Fetch beatmap mods/discussions', async () => {
  const client = testClient();

  const beatmapsToTest = [
    await fetchBeatmapMods(1725839, client),
  ];

  for (const beatmapDiscussions of beatmapsToTest) {
    const firstThread = beatmapDiscussions[0];


    expect(beatmapDiscussions.length).toBeGreaterThan(0);

    expect(firstThread.posts).toBeDefined();
    expect(firstThread.engaged_users).toBeDefined();
  }

});
