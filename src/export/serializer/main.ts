import { ParsedBeatmap } from "../../parse/types";
import {
  processVideoAndBackgroundEvents, processBreakEvents, processTimingPoints,
  processHitObjects, processKeyValuePairs
} from "./process";

import { END_SECTION, END_ROW } from "./util";

export function convertToOsuFile(parsedBeatmap: ParsedBeatmap): string {
  const serializedOsuFile: string =
    "osu file format v14" + END_SECTION +

    "[General]" + END_ROW +
    processKeyValuePairs(parsedBeatmap.General, ": ") + END_SECTION +

    "[Editor]" + END_ROW +
    processKeyValuePairs(parsedBeatmap.Editor, ": ") + END_SECTION +

    "[Metadata]" + END_ROW +
    processKeyValuePairs(parsedBeatmap.Metadata, ":") + END_SECTION +

    "[Difficulty]" + END_ROW +
    processKeyValuePairs(parsedBeatmap.Difficulty, ":") + END_SECTION +

    "[Events]" + END_ROW +
    "//Background and Video events" + END_ROW +
    processVideoAndBackgroundEvents(parsedBeatmap.Events) +

    "//Break Periods" + END_ROW +
    processBreakEvents(parsedBeatmap.Events) +

    "//Storyboard Layer 0 (Background)" + END_ROW +
    "//Storyboard Layer 1 (Fail)" + END_ROW +
    "//Storyboard Layer 2 (Pass)" + END_ROW +
    "//Storyboard Layer 3 (Foreground)" + END_ROW +
    "//Storyboard Layer 4 (Overlay)" + END_ROW +
    "//Storyboard Sound Samples" + END_SECTION +

    "[TimingPoints]" + END_ROW +
    processTimingPoints(parsedBeatmap.TimingPoints) + END_ROW +

    "[Colours]" + END_ROW +
    processKeyValuePairs(parsedBeatmap.Colours, " : ") + END_SECTION +

    "[HitObjects]" + END_ROW +
    processHitObjects(parsedBeatmap.HitObjects) + END_ROW;

  return serializedOsuFile;
}

