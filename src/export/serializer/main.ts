import { ParsedBeatmap } from "../../parse/types";
import { processVBEvents, processBreakEvents, processTimingPoints, 
  processColours, processHitObjects, processKVPairs 
} from "./process";

export function convertToOsuFile(parsedBeatmap: ParsedBeatmap): string {
  let serializedDotOsuFile: string = 
    "osu file format v14" + "\n\n" +

    "[General]" + "\n" +
    processKVPairs(parsedBeatmap.General, true) + "\n\n" +

    "[Editor]" + "\n" +
    processKVPairs(parsedBeatmap.Editor, true) + "\n\n" +

    "[Metadata]" + "\n" +
    processKVPairs(parsedBeatmap.Metadata, false) + "\n\n" +

    "[Difficulty]" + "\n" +
    processKVPairs(parsedBeatmap.Difficulty, false) + "\n\n" +

    "[Events]" + "\n" +
    "//Background and Video events" + "\n" +
    processVBEvents(parsedBeatmap.Events) +
    "//Break Periods" + "\n" +
    processBreakEvents(parsedBeatmap.Events) +
    "//Storyboard Layer 0 (Background)" + "\n" +
    "//Storyboard Layer 1 (Fail)" + "\n" +
    "//Storyboard Layer 2 (Pass)" + "\n" +
    "//Storyboard Layer 3 (Foreground)" + "\n" +
    "//Storyboard Layer 4 (Overlay)" + "\n" +
    "//Storyboard Sound Samples" + "\n\n" +

    "[TimingPoints]" + "\n" +
    processTimingPoints(parsedBeatmap.TimingPoints) + "\n" +

    "[Colours]" + "\n" +
    processColours(parsedBeatmap.Colours) + "\n\n" +
    
    "[HitObjects]" + "\n" +
    processHitObjects(parsedBeatmap.HitObjects) + "\n";

  return serializedDotOsuFile;
}

