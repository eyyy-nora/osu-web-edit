import {
  BeatmapColorSection,
  BeatmapDifficultySection,
  BeatmapEditorSection,
  BeatmapGeneralSection,
  BeatmapMetadataSection
} from "./sections";
import { BeatmapObject } from "./objects";
import { BeatmapEvent } from "./events";
import { BeatmapTimingPoint } from "./timing-points";

export interface Beatmap {
  general: BeatmapGeneralSection;
  editor: BeatmapEditorSection;
  metadata: BeatmapMetadataSection;
  difficulty: BeatmapDifficultySection;
  colors: BeatmapColorSection;


  events: BeatmapEvent[];
  timingPoints: BeatmapTimingPoint[];
  objects: BeatmapObject[];
}
