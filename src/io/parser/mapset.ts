import axios from "axios";
import jszip from "jszip";
import { beatmapFilename } from "src/io/serializer/util";
import { mimetypeFor } from "./mimetype";
import { parseOsuFile } from "./file";
import { parseOsuLayer } from "./layer";
import { BeatmapLayer, Mapset } from "../types";



export async function parseMapset(file: Blob | Uint8Array | ArrayBuffer): Promise<Mapset> {
  const zip = await jszip.loadAsync(file);

  const mapset: Mapset = {
    beatmaps: [],
    files: {},
  };

  const layers: Record<string, BeatmapLayer[]> = {};

  let cache: Record<string, Promise<Blob>> = {}

  for (const [filename, file] of Object.entries(zip.files)) {
    if (/\.osu$/.test(filename)) {
      const beatmap = await parseOsuFile(await file.async("string"));
      if (layers[filename]) {
        beatmap.layers = layers[filename];
        delete layers[filename];
      }
      mapset.beatmaps.push(beatmap);
    } else if (/\.[0-9]+\.osu-layer$/.test(filename)) {
      const matchName = filename.replace(/\.[0-9]+\.osu-layer$/, ".osu");
      const matching = mapset.beatmaps.find(beatmap => beatmapFilename(beatmap) === matchName)
      const parsed = parseOsuLayer(await file.async("string"));
      if (matching) matching.layers.push(parsed);
      else (layers[matchName] ??= []).push(parsed)
    } else {
      mapset.files[filename] = () => {
        if (cache[filename]) return cache[filename];
        return cache[filename] = file.async("arraybuffer")
          .then(result => new Blob([result],{
            type: mimetypeFor(filename)
          }));
      }
    }
  }

  return mapset;
}


export async function downloadMapset(url: string): Promise<Mapset> {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  return parseMapset(data);
}

export function readMapset(file: File): Promise<Mapset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      parseMapset(reader.result as ArrayBuffer).then(resolve).catch(reject);
    });
    reader.addEventListener("error", reject);
    reader.addEventListener("abort", reject);
    reader.readAsArrayBuffer(file);
  });
}
