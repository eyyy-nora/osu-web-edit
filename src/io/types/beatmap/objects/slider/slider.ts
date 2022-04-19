import { BeatmapSliderPoint } from "./point";
import { BeatmapSampleSet } from "../../sections";
import { BeatmapSliderType } from "./enums";
import { BeatmapObjectBase } from "../base";

export interface BeatmapSlider extends BeatmapObjectBase {
  type: "slider";
  sliderType: BeatmapSliderType;
  slides: number;
  length: number;
  edgeSounds: number[];
  edgeSets: [number, number][];
  path: BeatmapSliderPoint[];
}
