import { BeatmapLayer } from "../types";

export function parseOsuLayer(fileContent: string): BeatmapLayer {
  return JSON.parse(fileContent);
}
