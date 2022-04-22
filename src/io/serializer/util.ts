import { Beatmap, Mapset } from "../types";

export function pascal(name: string): string {
  return name[0].toUpperCase() + name.slice(1);
}

export function reverseLookup(lookup: Record<string, string>, val: string, fallback = ""): string {
  for (const [key, value] of Object.entries(lookup))
    if (value === val) return key;
  return fallback;
}

export function serializeConfigValue(value: any) {
  switch (typeof value) {
    case "boolean": return value ? "1" : "0";
    case "number": return `${value}`;
    case "string": return value;
  }
}


export function beatmapFilename({ metadata }: Beatmap): string {
  return `${metadata.artist} - ${metadata.title} (${metadata.creator}) [${metadata.version}].osu`
}

export function mapsetFilename(mapset: Mapset): string {
  const { beatmapSetID, artist, title } =
  mapset.beatmaps[0]?.metadata ?? { artist: "N/A", title: "Unknown" };
  if (beatmapSetID !== undefined) return `${beatmapSetID} ${artist} - ${title}.osz`;
  return `${artist} - ${title}.osz`;
}


export function layerFilename({ metadata }: Beatmap, index: number): string {
  return `${metadata.artist} - ${metadata.title} (${metadata.creator}) [${metadata.version}].${index}.osu-layer`;
}
