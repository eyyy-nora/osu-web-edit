import axios from "axios";
import { parseMapSet } from "../parse/parse-osu-file";

export async function hello(): Promise<{ message: string }> {
  const { data } = await axios.get("https://owe.monster/.netlify/functions/hello");
  return data;
}

export async function parse(beatmap = "/DotEXE - Battlecry.osz") {
  const { data: compressedBeatmap } = await axios.get(beatmap, {
    responseType: "blob"
  });

  return parseMapSet(compressedBeatmap);
}
