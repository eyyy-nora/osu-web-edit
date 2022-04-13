import fs from "fs";
import { convertToOsuFile } from "../src/export/serializer/main";
import { parseOsuFile } from "../src/parse/parse-osu-file";

test('Serializer: \'convertToOsuFile()\' result should be a valid .osu file', () => {
  let convertedMaps = [
    serializeBeatmap("coldrain"),
    serializeBeatmap("centipede"),
    serializeBeatmap("seriousshit"),
    serializeBeatmap("testfile"),
    serializeBeatmap("ladedade"),
    serializeBeatmap("cyclehit")
  ]

  for (const beatmap of convertedMaps) {
    expect(beatmap).toMatchSnapshot();
  }
})

function serializeBeatmap(beatmapName: string) {
  const beatmap = fs.readFileSync(__dirname + `/assets/${beatmapName}.osu`);

  return convertToOsuFile(parseOsuFile(beatmap.toString()));
}
