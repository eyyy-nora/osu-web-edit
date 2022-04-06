import fs from "fs";
import { convertToOsuFile } from "../src/export/serializer/main";
import { parseOsuFile, parseSlider } from "../src/parse/parse-osu-file";

test('Serializer: \'convertToOsuFile()\' result should be a valid .osu file', () => {
  const coldrain = fs.readFileSync(__dirname + "/assets/coldrain.osu");
  const centipede = fs.readFileSync(__dirname + "/assets/centipede.osu");
  const seriousshit = fs.readFileSync(__dirname + "/assets/seriousshit.osu");
  const battlecry = fs.readFileSync(__dirname + "/assets/testfile.osu");
  const ladedade = fs.readFileSync(__dirname + "/assets/ladedade.osu")

  let convertedFiles = [
    convertToOsuFile(parseOsuFile(coldrain.toString())),
    convertToOsuFile(parseOsuFile(centipede.toString())),
    convertToOsuFile(parseOsuFile(seriousshit.toString())),
    convertToOsuFile(parseOsuFile(battlecry.toString())),
    convertToOsuFile(parseOsuFile(ladedade.toString()))
  ]

  convertedFiles.forEach(map => {
    expect(map).toMatchSnapshot();
  })
})
