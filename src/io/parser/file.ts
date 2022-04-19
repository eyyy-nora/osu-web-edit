import { Beatmap, BeatmapColorSection } from "../types";
import { parseOsuEvent } from "./event";
import { parseOsuObject } from "./object";
import { parseOsuTimingPoint } from "./timing-point";
import { camel } from "./util";
import { beatmapDefaults, mappedSections } from "../constants";
import { valueMap } from "./value-map";

export async function parseOsuFile(data: string): Promise<Beatmap> {
  const beatmap = beatmapDefaults();
  let section: Beatmap[keyof Beatmap] = undefined, sectionKey: keyof Beatmap = undefined;

  for (const line of data.split(/[\r\n]+/)) {
    // comments & empty
    if (!line || line.startsWith(";") || line.startsWith("//")) continue;

    // new section start
    if (line.startsWith("[")) {
      sectionKey = mappedSections[line.replace(/[\[\]]/g, "").trim()];
      section = beatmap[sectionKey];
      continue;
    }

    switch (sectionKey) {
      case "objects":      (section as any[]).push(parseOsuObject(line));      break;
      case "events":       (section as any[]).push(parseOsuEvent(line));       break;
      case "timingPoints": (section as any[]).push(parseOsuTimingPoint(line)); break;

      case "general": case "metadata": case "editor": case "difficulty": {
        let [key, value] = line.split(":", 2).map(str => str.trim());
        key = camel(key);
        if (key in valueMap) value = valueMap[key](value);
        section[key] = value;
        break;
      }

      case "colors": {
        const [key, value] = line.split(":", 2).map(str => str.trim());
        const color = value.split(",").map(it => Number(it.trim())) as any;
        if (/^Color[0-9]+/.test(key)) (section as BeatmapColorSection).colors.push(color);
        else section[camel(key)] = color;
      }
    }
  }

  return beatmap;
}




