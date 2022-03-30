import axios from "axios";
import jszip from "jszip";
import { parseOsuFile } from "../parse/parse-osu-file";

export async function hello(): Promise<{ message: string }> {
  const { data } = await axios.get("https://owe.monster/.netlify/functions/hello");
  return data;
}

export async function parse(beatmap = "/DotEXE - Battlecry.osz") {
  const { data: compressedBeatmap } = await axios.get(beatmap, {
    responseType: "blob"
  });

  const zip = await jszip.loadAsync(compressedBeatmap);

  for (const [fileName, entry] of Object.entries(zip.files)) {
    if (/\.osu$/.test(fileName)) {
      const content = await entry.async("string");

      const parsedBeatmap = parseOsuFile(content);
      console.log(parsedBeatmap);
    }
  }
}
