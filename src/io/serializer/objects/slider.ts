import { sliderTypes } from "../../constants";
import { reverseLookup } from "../util";
import { serializeObjectBase } from "./base";
import { serializeObjectSamples } from "./samples";
import { BeatmapSlider } from "../../types";



export function serializeSlider(slider: BeatmapSlider): string {
  return [
    serializeObjectBase(slider),
    `${reverseLookup(sliderTypes, slider.sliderType)}|${
      slider.path.map(point => point.anchor ? `${point.x}:${point.y}|${point.x}:${point.y}` : `${point.x}:${point.y}`).join("|")
    }`,
    slider.slides,
    slider.length,
    slider.edgeSounds.join("|"),
    slider.edgeSets.map(set => set.join(":")).join("|"),
    serializeObjectSamples(slider.hitSample),
  ].filter(it => it !== undefined && it !== "").join(",");
}
