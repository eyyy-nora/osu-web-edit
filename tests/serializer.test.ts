import { promises as fs } from "fs";
import { serializeBeatmap } from "../src/io/serializer/beatmap";
import { parseOsuFile } from "../src/io/parser/file";
import { Beatmap } from "../src/io/types/beatmap/beatmap";

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
  const beatmap = await fs.readFile(__dirname + `/assets/${beatmapName}.osu`);
  return serializeBeatmap(await parseOsuFile(beatmap.toString()));
}
