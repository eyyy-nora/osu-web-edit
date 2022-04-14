import { ParsedMapSet, ParsedBeatmap } from "../../parse/types";

export function getBeatmapTitle(beatmapset: ParsedMapSet): string {
  const beatmap = beatmapset.difficulties[0];

  return (
    `${beatmap.Metadata.BeatmapSetID} ${beatmap.Metadata.Artist} - ${beatmap.Metadata.Title}`
  );
}

export function getFileName(metadata: ParsedBeatmap["Metadata"]): string {
  return (
    `${metadata.Artist} - ${metadata.Title} (${metadata.Creator}) [${metadata.Version}].osu`
  );
}
