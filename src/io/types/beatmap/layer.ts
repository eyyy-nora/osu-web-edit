import { BeatmapObject } from "./objects";

export interface BeatmapLayer {
  name: string;
  id: string;
  objects: BeatmapObject[];
}
