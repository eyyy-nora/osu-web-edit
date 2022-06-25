import { serializeBeatmap } from "../src/io/serializer/beatmap";
import { getBeatmap } from "./utils/beatmap";

test('Serializer: \'convertToOsuFile()\' result should be a valid .osu file', async () => {
  let convertedMaps = await Promise.all([
    testSerializeBeatmapIn("centipede"),
    testSerializeBeatmapIn("seriousshit"),
    testSerializeBeatmapIn("testfile"),
    testSerializeBeatmapIn("ladedade"),

    // todo: uncomment mania map test
    // testSerializeBeatmapIn("cyclehit")
  ]);

  for (const beatmap of convertedMaps) {
    expect(beatmap).toMatchSnapshot();
  }
})

async function testSerializeBeatmapIn(beatmapName: string) {
  return serializeBeatmap(await getBeatmap(beatmapName));
}
