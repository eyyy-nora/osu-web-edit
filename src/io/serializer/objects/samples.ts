import { BeatmapHitSamples } from "../../types";

export function serializeObjectSamples(samples: BeatmapHitSamples): string | undefined {
  if (samples.noSample) return;
  return [
    samples.normalSet,
    samples.additionalSet,
    samples.index,
    samples.volume,
    samples.filename,
  ].join(":");
}
