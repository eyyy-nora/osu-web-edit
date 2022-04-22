import { serializeObjectBase } from "./base";
import { serializeObjectSamples } from "./samples";
import { BeatmapCircle } from "../../types";



export function serializeCircle(circle: BeatmapCircle): string {
  return [
    serializeObjectBase(circle),
    serializeObjectSamples(circle.hitSample),
  ].filter(it => it !== undefined).join(",");
}
