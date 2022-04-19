import { BeatmapObject } from "../../types";
import { serializeObject } from "../objects";

export function serializeObjectSection(objects: BeatmapObject[]): string {
  const mapped = objects.map(serializeObject);
  mapped.unshift("[HitObjects]");
  return mapped.join("\n");
}
