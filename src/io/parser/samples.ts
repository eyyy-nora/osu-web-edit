import { BeatmapHitSamples } from "../types";
import { firstFourAsNumber } from "./util";

export function parseOsuHitSamples(sample: string): BeatmapHitSamples {
  if (!sample.includes(":")) return {
    normalSet: 0,
    additionalSet: 0,
    index: 0,
    volume: 0,
    filename: "",
    noSample: true,
  };
  const [normalSet, additionalSet, index, volume, filename] =
    sample.split(":").map(firstFourAsNumber) as
      [number, number, number, number, string];
  return { normalSet, additionalSet, index, volume, filename };
}
