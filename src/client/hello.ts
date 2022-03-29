import axios from "axios";
import jszip from "jszip";

export async function hello(): Promise<{ message: string }> {
  const { data } = await axios.get("/.netlify/functions/hello");
  return data;
}


export async function parse(beatmap = "/DotEXE - Battlecry.osz") {
  const zip = await jszip.loadAsync(beatmap);
  for (const [fileName, entry] of Object.entries(zip.files)) {
    if (/\.osu$/.test(fileName)) {
      const content = await entry.async("string");
    }
  }
}
