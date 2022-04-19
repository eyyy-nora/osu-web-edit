import { beatmapFilename, mapsetFilename } from "./util";
import { Mapset } from "../types";
import { serializeBeatmap } from "./beatmap";
import jszip from "jszip";
import { saveAs } from "file-saver";


export async function serializeMapset(mapset: Mapset): Promise<Blob> {
  const zip = jszip();

  for (const [filename, file] of Object.entries(mapset.files))
    zip.file(filename, await file());

  for (const beatmap of mapset.beatmaps)
    zip.file(beatmapFilename(beatmap), await serializeBeatmap(beatmap));

  return await zip.generateAsync({ type: "blob", compression: "STORE" });
}


export async function exportMapset(mapset: Mapset): Promise<void> {
  saveAs(await serializeMapset(mapset), mapsetFilename(mapset));
}
