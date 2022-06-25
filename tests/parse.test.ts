import { getBeatmap } from "./utils/beatmap";

test('File parsing: .osu parsing', async () => {
  // the 'getBeatmap' function already parses the beatmap
  // so we just need to test if it matches the snapshot.
  const beatmapsToTest = [
    await getBeatmap("testfile"),
    await getBeatmap("seriousshit"),

    // todo: uncomment mania map test
    // await getBeatmap("cyclehit");
  ];

  for (const beatmap of beatmapsToTest) {
    expect(beatmap).toMatchSnapshot();
  }

});
