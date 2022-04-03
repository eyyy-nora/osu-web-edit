import fs from "fs";
import { convertToOsuFile } from "../src/export/serializer/main";
import { parseOsuFile, parseSlider } from "../src/parse/parse-osu-file";

test('Serializer: \'convertToOsuFile()\' result should be a valid .osu file', () => {
  /**
   * here we test different types of beatmaps in ./assets 
   * to see if the serializer covers 100% of .osu files
   */ 

  const coldrain = fs.readFileSync(__dirname + "/assets/coldrain.osu");
  const centipede = fs.readFileSync(__dirname + "/assets/centipede.osu");
  const seriousshit = fs.readFileSync(__dirname + "/assets/seriousshit.osu");
  const battlecry = fs.readFileSync(__dirname + "/assets/testfile.osu");

  const serialColdRain = convertToOsuFile(parseOsuFile(coldrain.toString()));
  const serialCentipede = convertToOsuFile(parseOsuFile(centipede.toString()));
  const serialSeriousShit = convertToOsuFile(parseOsuFile(seriousshit.toString()));
  const serialBattlecry = convertToOsuFile(parseOsuFile(battlecry.toString()));

  expect(serialColdRain).toMatchSnapshot();
  expect(serialCentipede).toMatchSnapshot();
  expect(serialSeriousShit).toMatchSnapshot();
  expect(serialBattlecry).toMatchSnapshot();
})