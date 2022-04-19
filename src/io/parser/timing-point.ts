import { BeatmapTimingPoint } from "../types";
import { bitmasks, sampleSets } from "src/io/constants";


export function parseOsuTimingPoint(line: string): BeatmapTimingPoint {
  const [time, beatLength, meter, sampleSetIndex, sampleIndex, volume, uninherited, effects] = line.split(",").map(Number);
  const kiai = !!(effects & bitmasks.kiai);
  const omitFirstBarLine = !!(effects & bitmasks.omitFirstBarLine);
  const sampleSet = sampleSets[sampleSetIndex];

  if (uninherited) return {
    inherited: false,
    kiai,
    meter,
    time,
    volume,
    sampleIndex,
    beatLength,
    omitFirstBarLine,
    sampleSet,
  };

  else return {
    inherited: true,
    kiai,
    time,
    volume,
    sampleSet,
    sampleIndex,
    omitFirstBarLine,
    sliverVelocityMultiplier: beatLength,
  };
}
