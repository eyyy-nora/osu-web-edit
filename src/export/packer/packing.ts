import { saveAs } from "file-saver";
import JSZip from "jszip";
import { getMapsetContext } from "../../context/mapset-context";
import { ParsedMapSet } from "../../parse/types";
import { convertToOsuFile } from "../serializer";
import { getFileName, getBeatmapTitle } from "./util";

export function compressToOsz() {
  const { mapset, folder } = getMapsetContext();

  let beatmapset: ParsedMapSet;
    mapset.subscribe(map =>  beatmapset = map);

  let mapFolder: JSZip;
    folder.subscribe(folder => mapFolder = folder);

  return async () => {
    if (!beatmapset || !mapFolder) return;

    for (const diff of beatmapset.difficulties) {
      const diffFilename = getFileName(diff.Metadata);

      mapFolder.file(diffFilename, convertToOsuFile(diff));
    }

    for (const [filename, content] of Object.entries(beatmapset.files)) {
      mapFolder.file(filename, content);
    }

    mapFolder.generateAsync({ type: "blob" }).then(blob => {
      saveAs(blob, `${getBeatmapTitle(beatmapset)}.osz`);
    });

  }
}
