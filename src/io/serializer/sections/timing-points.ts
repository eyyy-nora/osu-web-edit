import { BeatmapTimingPoint } from "../../types";
import { bitmasks, sampleSets } from "../../constants";
import { reverseLookup } from "../util";

export function serializeTimingPointSection(points: BeatmapTimingPoint[]): string {
  const mapped = points.map(serializeTimingPoint);
  mapped.unshift("[TimingPoints]");
  return mapped.join("\n");
}

export function serializeTimingPoint(point: BeatmapTimingPoint): string {
  const effects = (point.kiai ? bitmasks.kiai : 0) | (point.omitFirstBarLine ? bitmasks.omitFirstBarLine : 0);
  if (point.inherited)
    return `${point.time},${point.sliverVelocityMultiplier},0,${reverseLookup(sampleSets, point.sampleSet)},${point.volume},1,${effects}`
  else if (point.inherited === false)
    return `${point.time},${point.beatLength},${point.meter},${reverseLookup(sampleSets, point.sampleSet)},${point.volume},1,${effects}`
}
