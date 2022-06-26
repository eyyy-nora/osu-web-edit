import { getParsedBeatmap } from "./utils/beatmap";

test('File parsing: .osu parsing', async () => {
  // the 'getParsedBeatmap' function already parses the beatmap
  // so we just need to test if it matches the snapshot.
  const beatmapsToTest = [
    await getParsedBeatmap("testfile"),
    await getParsedBeatmap("seriousshit"),

    // todo: uncomment mania map test
    // await getParsedBeatmap("cyclehit");
  ];

  for (const beatmap of beatmapsToTest) {
    expect(beatmap).toMatchSnapshot();
  }

});
