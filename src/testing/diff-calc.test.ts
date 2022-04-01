import { parseOsuFile } from "../parse/parse-osu-file";
import fs from "fs";
import { computeStarRating } from "../star-rating/calculator-methods";

test('Star Rating Calculation', () => {
  const dotOsuData = fs.readFileSync(__dirname + "/testfile.osu");
  const parsedDotOsu = parseOsuFile(dotOsuData.toString())

  let computedBeatmapStarRating = computeStarRating(dotOsuData.toString());

  expect(computedBeatmapStarRating).toMatchSnapshot();
});