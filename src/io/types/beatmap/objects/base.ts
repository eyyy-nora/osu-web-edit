import { BeatmapHitSamples } from "./samples";



export interface BeatmapObjectBase {
  x: number;
  y: number;
  time: number;
  hitSound: number;
  hitSample: BeatmapHitSamples;
  skipColors: number;
  newCombo: boolean;
}
