import { parseOsuFile } from "../src/parse/parse-osu-file";
import fs from "fs";

test('File parsing: .osu parsing', () => {
  const dotOsuData = fs.readFileSync(__dirname + "/assets/testfile.osu");
  const parsedDotOsu = parseOsuFile(dotOsuData.toString())

  expect(parsedDotOsu.General).toMatchSnapshot();
  expect(parsedDotOsu.Editor).toMatchSnapshot();
  expect(parsedDotOsu.Metadata).toMatchSnapshot();
  expect(parsedDotOsu.Events).toMatchSnapshot();
  expect(parsedDotOsu.TimingPoints).toMatchSnapshot();
  expect(parsedDotOsu.HitObjects).toMatchSnapshot();

});
