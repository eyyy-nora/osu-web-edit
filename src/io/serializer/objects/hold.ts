import { serializeObjectBase } from "./base";
import { serializeObjectSamples } from "./samples";
import { BeatmapHold } from "../../types";



export function serializeHold(hold: BeatmapHold): string {
  return [
    serializeObjectBase(hold),
    hold.end,
    serializeObjectSamples(hold.hitSample),
  ].join(",");
}
