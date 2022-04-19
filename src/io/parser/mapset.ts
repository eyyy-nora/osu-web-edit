import axios from "axios";
import jszip from "jszip";
import { mimetypeFor } from "./mimetype";
import { parseOsuFile } from "./file";
import { Mapset } from "../types";



export async function parseMapset(file: Blob | Uint8Array | ArrayBuffer): Promise<Mapset> {
  const zip = await jszip.loadAsync(file);

  const mapset: Mapset = {
    beatmaps: [],
    files: {},
  };

  let cache: Record<string, Promise<Blob>> = {}

  for (const [filename, file]of Object.entries(zip.files)) {
    if (/\.osu$/.test(filename)) {
      mapset.beatmaps.push(await parseOsuFile(await file.async("string")));
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
