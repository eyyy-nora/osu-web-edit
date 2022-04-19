import { BeatmapHitSamples } from "../types";
import { firstFourAsNumber } from "./util";

export function parseOsuHitSamples(sample: string): BeatmapHitSamples {
  const [normalSet, additionalSet, index, volume, filename] =
    sample.split(":").map(firstFourAsNumber) as
      [number, number, number, number, string];
  return { normalSet, additionalSet, index, volume, filename };
}
