import { parseOsuFile } from "../src/io/parser/file";
import { Beatmap } from "../src/io/types/beatmap/beatmap";
import fs from "fs";

test('File parsing: .osu parsing', () => {
  testOsuFileParserIn("testfile");
  testOsuFileParserIn("cyclehit");
  testOsuFileParserIn("coldrain");
  testOsuFileParserIn("seriousshit");
});

async function testOsuFileParserIn(filename: string) {
  const dotOsuData = fs.readFileSync(__dirname + `/assets/${filename}.osu`);
  const parsedDotOsu = await parseOsuFile(dotOsuData.toString());

  testBeatmap(parsedDotOsu);
}

function testBeatmap(parsedDotOsu: Beatmap) {
  expect(parsedDotOsu.general).toMatchSnapshot();
  expect(parsedDotOsu.editor).toMatchSnapshot();
  expect(parsedDotOsu.metadata).toMatchSnapshot();
  expect(parsedDotOsu.events).toMatchSnapshot();
  expect(parsedDotOsu.timingPoints).toMatchSnapshot();
  expect(parsedDotOsu.objects).toMatchSnapshot();
}
