import axios from "axios";
import jszip from "jszip";

import type { ParsedBeatmap, HitObject } from "../parse/beatmap-parse";

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

      const parsedBeatmap = parseINIString(content);
      
      const parsedHitObjects = parseHitObjects(parsedBeatmap.HitObjects);
    }
  }
}

// TODO: refactor those parse functions and maybe move then to a separeted file

function parseHitObjects(HitObjects: string[]): HitObject[] {
  let beatmapHitObjects: HitObject[] = [];

  for (const line of HitObjects) {
    let hitObjectParameters = line.split(",");

    let HitObjectBeingRead: HitObject = {
      x: Number(hitObjectParameters[0]),
      y: Number(hitObjectParameters[1]),
      Time: Number(hitObjectParameters[2]),
      Type: Number(hitObjectParameters[3]),
      HitSound: Number(hitObjectParameters[4]),

      // those two parameters need more than just a split(",") to 
      // be separated properly (they are gonna be undefined just for abit c:)

      ObjectParameters: undefined,
      HitSample: undefined
    };

    beatmapHitObjects.push(HitObjectBeingRead);
  }

  return beatmapHitObjects;
}

function parseINIString(data: string): ParsedBeatmap {
  const arraySections = ["HitObjects", "TimingPoints", "Events"];

  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;

  for (const line of lines) {
    if (!line || line.startsWith(";") || line.startsWith("//")) continue; // comments

    if (line.startsWith("[")) {
      section = line.replace(/[\[\]]/g, "");

    } else if (line.includes(":") && !arraySections.includes(section)) {
      const [key, val] = line.split(":", 2).map((str) => str.trim());
      
      let parsedValue = val;
      try { parsedValue = JSON.parse(val); }
      catch {}

      if (section) (value[section] ??= {})[key] = parsedValue;
      else value[key] = parsedValue;
      
    } else if (section) (value[section] ??= []).push(line);
  }

  return value;
}