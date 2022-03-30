import { parseOsuFile } from "../parse/parse-osu-file";
import fs from "fs";

test('.osu File Parsing', () => {
  const dotOsuData = fs.readFileSync(__dirname + "/testfile.osu");
  const parsedDotOsu = parseOsuFile(dotOsuData.toString())
  
  expect(parsedDotOsu.General).toMatchSnapshot();
  expect(parsedDotOsu.Editor).toMatchSnapshot();
  expect(parsedDotOsu.Metadata).toMatchSnapshot();
  expect(parsedDotOsu.Events).toMatchSnapshot();
  expect(parsedDotOsu.TimingPoints).toMatchSnapshot();
  expect(parsedDotOsu.HitObjects).toMatchSnapshot();

});