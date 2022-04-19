import { BeatmapSampleSet } from "./sections";

export interface BeatmapTimingPointBase {
  time: number;
  sampleSet: "normal" | BeatmapSampleSet;
  sampleIndex: number;
  volume: number;
  kiai: boolean;
  omitFirstBarLine: boolean;
}


export interface BeatmapUninheritedTimingPoint extends BeatmapTimingPointBase {
  inherited: false;
  beatLength: number;
  meter: number;
}

export interface BeatmapInheritedTimingPoint extends BeatmapTimingPointBase {
  inherited: true;
  sliverVelocityMultiplier: number;
}

export type BeatmapTimingPoint = BeatmapInheritedTimingPoint | BeatmapUninheritedTimingPoint;
