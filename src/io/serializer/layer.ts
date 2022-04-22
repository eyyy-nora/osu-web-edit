import { BeatmapLayer } from "../types";

export function serializeOsuLayer(layer: BeatmapLayer) {
  return JSON.stringify(layer);
}
