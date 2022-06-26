import { serializeBeatmap } from "../src/io/serializer/beatmap";
import { getParsedBeatmap } from "./utils/beatmap";

test('Serializer: \'convertToOsuFile()\' result should be a valid .osu file', async () => {
  let convertedMaps = await Promise.all([
    testSerializeBeatmap("centipede"),
    testSerializeBeatmap("seriousshit"),
    testSerializeBeatmap("testfile"),
    testSerializeBeatmap("ladedade"),

    // todo: uncomment mania map test
    // testSerializeBeatmap("cyclehit")
  ]);

  for (const beatmap of convertedMaps) {
    expect(beatmap).toMatchSnapshot();
  }
})

async function testSerializeBeatmap(beatmapName: string) {
  return serializeBeatmap(await getParsedBeatmap(beatmapName));
}
