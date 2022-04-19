import { Beatmap } from "../types";
import {
  serializeColorSection,
  serializeDifficultySection,
  serializeEditorSection,
  serializeEventSection,
  serializeGeneralSection,
  serializeMetadataSection,
  serializeObjectSection,
  serializeTimingPointSection
} from "./sections";



const beatmapPrefix = (version = 14) => `osu file format v${version}`;


export async function serializeBeatmap(beatmap: Beatmap): Promise<string> {
  return [
    beatmapPrefix(),
    serializeGeneralSection(beatmap.general),
    serializeEditorSection(beatmap.editor),
    serializeMetadataSection(beatmap.metadata),
    serializeDifficultySection(beatmap.difficulty),
    serializeEventSection(beatmap.events),
    serializeTimingPointSection(beatmap.timingPoints),
    serializeColorSection(beatmap.colors),
    serializeObjectSection(beatmap.objects),
  ].join("\n\n\n");
}



