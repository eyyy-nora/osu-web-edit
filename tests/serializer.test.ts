import { promises as fs } from "fs";
import { convertToOsuFile } from "src/export/serializer/main";
import { parseOsuFile } from "src/parse/parse-osu-file";

test('Serializer: \'convertToOsuFile()\' result should be a valid .osu file', async () => {
  let convertedMaps = await Promise.all([
    serializeBeatmap("coldrain"),
    serializeBeatmap("centipede"),
    serializeBeatmap("seriousshit"),
    serializeBeatmap("testfile"),
    serializeBeatmap("ladedade"),
    serializeBeatmap("cyclehit")
  ]);

  for (const beatmap of convertedMaps) {
    expect(beatmap).toMatchSnapshot();
  }
})

async function serializeBeatmap(beatmapName: string) {
  const beatmap = await fs.readFile(__dirname + `/assets/${beatmapName}.osu`);
  return convertToOsuFile(parseOsuFile(beatmap.toString()));
}
