import { serializeObjectBase } from "./base";
import { serializeObjectSamples } from "./samples";
import { BeatmapSpinner } from "../../types";


export function serializeSpinner(spinner: BeatmapSpinner): string {
  return [
    serializeObjectBase(spinner),
    spinner.end,
    serializeObjectSamples(spinner.hitSample),
  ].join(",");
}
