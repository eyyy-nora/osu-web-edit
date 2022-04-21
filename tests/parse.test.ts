import { parseOsuFile } from "src/parse/parse-osu-file";
import fs from "fs";
import { ParsedBeatmap } from "src/parse/types";

test('File parsing: .osu parsing', () => {
  parseOsuFileTester("testfile");
  parseOsuFileTester("cyclehit");
  parseOsuFileTester("coldrain");
  parseOsuFileTester("seriousshit");
});

function parseOsuFileTester(filename: string) {
  const dotOsuData = fs.readFileSync(__dirname + `/assets/${filename}.osu`);
  const parsedDotOsu = parseOsuFile(dotOsuData.toString());

  testBeatmap(parsedDotOsu);
}

function testBeatmap(parsedDotOsu: ParsedBeatmap) {
  expect(parsedDotOsu.General).toMatchSnapshot();
  expect(parsedDotOsu.Editor).toMatchSnapshot();
  expect(parsedDotOsu.Metadata).toMatchSnapshot();
  expect(parsedDotOsu.Events).toMatchSnapshot();
  expect(parsedDotOsu.TimingPoints).toMatchSnapshot();
  expect(parsedDotOsu.HitObjects).toMatchSnapshot();
}
