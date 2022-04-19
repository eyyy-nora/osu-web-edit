import { BeatmapHitSamples } from "../../types";

export function serializeObjectSamples(samples: BeatmapHitSamples): string {
  return [
    samples.normalSet,
    samples.additionalSet,
    samples.index,
    samples.volume,
    samples.filename,
  ].join(":");
}
