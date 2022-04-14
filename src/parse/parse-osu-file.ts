// noinspection JSBitwiseOperatorUsage

import axios from "axios";
import jszip from "jszip";
import { MapsetWithFolder } from "../context/mapset-context";
import {
  BIT0,
  BIT1,
  BIT2,
  BIT3,
  BIT4,
  BIT5,
  BIT6,
  BIT7
} from "../util/numbers";
import type {
  ParsedBeatmap,
  ParsedEvent,
  ParsedHitCircle,
  ParsedHitObject,
  ParsedHitSamples,
  ParsedHold,
  ParsedMapSet,
  ParsedPoint,
  ParsedSlider,
  ParsedSpinner,
  ParsedTimingPoint
} from "./types";

export function readMapset(file: File): Promise<MapsetWithFolder>  {
  return new Promise<MapsetWithFolder>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      parseMapset(reader.result as ArrayBuffer).then(resolve).catch(reject);
    });
    reader.addEventListener("error", reject);
    reader.addEventListener("abort", reject);
    reader.readAsArrayBuffer(file);
  });
}

export async function downloadMapset(url: string): Promise<MapsetWithFolder>  {
  const { data } = await axios.get(url, { responseType: "blob" });
  return parseMapset(data);
}

export function mimeTypeFor(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  switch (ext) {
    case ".mp3": return "audio/mp3";
    case ".wav": return "audio/wav";
    case ".ogg": return "audio/ogg";
    default: return "application/octet-stream";
  }
}


export async function parseMapset(file: Blob | Uint8Array | ArrayBuffer): Promise<MapsetWithFolder> {
  const zip = await jszip.loadAsync(file);

  const mapset: ParsedMapSet = { difficulties: [], files: {} };

  for (const [fileName, entry] of Object.entries(zip.files)) {
    if (/\.osu$/.test(fileName)) {
      const content = await entry.async("string");
      mapset.difficulties.push(parseOsuFile(content));
    } else {
      const type = mimeTypeFor(fileName)
      mapset.files[fileName] = new Blob([await entry.async("blob")], { type });
    }
  }

  return { mapSet: mapset, mapFolder: zip } as MapsetWithFolder;
}



const arraySections = ["HitObjects", "TimingPoints", "Events"];
export function parseOsuFile(data: string): ParsedBeatmap {
  const value = {};
  const lines = data.split(/[\r\n]+/);
  let section = null;

  for (const line of lines) {
    if (!line || line.startsWith(";") || line.startsWith("//")) continue; // comments

    if (line.startsWith("[")) {
      section = line.replace(/[\[\]]/g, "");
    } else if (section && arraySections.includes(section)) {
      value[section] ??= [];
      switch (section) {
        case "HitObjects": value[section]!.push(parseHitObject(line)); break;
        case "TimingPoints": value[section]!.push(parseTimingPoint(line)); break;
        case "Events": value[section]!.push(parseEvent(line)); break;
      }
    } else if (section && section === "Colours") {
      value[section] ??= {};
      const [key, val] = line.split(":", 2).map((str) => str.trim());
      const [r, g, b] = val.split(",").map(Number);
      value[section][key] = [r, g, b];
    } else if (line.includes(":") && !arraySections.includes(section)) {
      const [key, val] = line.split(":", 2).map((str) => str.trim());
      let parsedValue = val;
      try { parsedValue = JSON.parse(val); }
      catch {}
      if (section) (value[section] ??= {})[key] = parsedValue;
      else value[key] = parsedValue;
    }
  }

  return value as ParsedBeatmap;
}


export function parseTimingPoint(line: string): ParsedTimingPoint {
  const [time, beatLength, meter, sampleSet, sampleIndex, volume, uninerited, effects] = line.split(",").map(Number);
  const inherited = !uninerited;
  const kiai = !!(effects & BIT0);
  const omitFirstBarLine = !!(effects & BIT3);
  return { time, beatLength, meter, inherited, kiai, omitFirstBarLine, sampleIndex, sampleSet, volume };
}

export function parseEvent(line: string): ParsedEvent {
  const [type_, startTime, ...params] = line.split(",");
  switch (type_) {
    case "0":
      return { type: "background", time: +startTime, filename: params[0], x: +params[1], y: +params[2] };
    case "Video":
    case "1":
      return { type: "video", time: +startTime, filename: params[0], x: +params[1], y: +params[2] };
    case "2":
    case "Break":
      return { type: "break", time: +startTime, end: +params[0] };
  }
}


const firstFiveAsNumber = (part: string, index: number) => index <= 4 ? +part : part;
const firstFourAsNumber = (part: string, index: number) => index <= 3 ? +part : part;

export function parseHitObject(line: string): ParsedHitObject {
  const [x, y, time, type_, hitSound, ...rest] = line.split(",").map(firstFiveAsNumber) as [number, number, number, number, number, ...string[]];
  const newCombo = !!(type_ & BIT2);
  const skipColors = (type_ & (BIT4 | BIT5 | BIT6)) >> 4;
  const hitSample = parseHitSamples(rest[rest.length - 1]);

  let value: ParsedHitObject;

  if (type_ & BIT0) value = parseCircle();
  else if (type_ & BIT1) value = parseSlider(...rest as [string, string, string, string, string]);
  else if (type_ & BIT3) value = parseSpinner(rest[0]);
  else if (type_ & BIT7) value = parseHold(rest[0]);
  else throw new Error("Invalid object type " + type_);

  Object.assign(value, { x, y, time, newCombo, skipColors, hitSound, hitSample });

  return value;
}

export function parseHitSamples(sample: string): ParsedHitSamples {
  const [normalSet, additionalSet, index, volume, filename] = sample.split(":").map(firstFourAsNumber) as [number, number, number, number, string];
  return { normalSet, additionalSet, index, volume, filename };
}

export function parseSpinner(end: string): ParsedSpinner {
  return { type: "spinner", end: +end } as ParsedSpinner;
}

export function parseHold(end: string): ParsedHold {
  return { type: "hold", end: +end } as ParsedHold;
}

export function parseCircle(): ParsedHitCircle {
  return { type: "circle" } as ParsedHitCircle;
}

const sliderTypes = {
  "L": "linear",
  "P": "circle",
  "B": "bezier",
  "C": "catmull",
} as const;

export function parseSlider(curveTypeAndPoints: string, slides: string, length: string, edgeSounds: string, edgeSets: string): ParsedSlider {
  const [prefix, ...points] = curveTypeAndPoints.split("|");
  const sliderType = sliderTypes[prefix];
  const pathSegments = parseSliderPoints(points);
  return {
    type: "slider",
    sliderType,
    pathSegments,
    slides: +slides,
    length: +length,
    edgeSounds: edgeSounds?.split("|").map(sound => +sound) ?? [],
    edgeSets: edgeSets?.split("|") ?? [],
  } as ParsedSlider;
}

export function parseSliderPoints(points: string[]): ParsedPoint[] {
  const pathSegments: ParsedPoint[] = [];
  let last: [number, number] | undefined = undefined;
  for (const [x, y] of points.map(point => point.split(":").map(value => +value)) as [number, number][]) {
    if (last && last[0] === x && last[1] === y) pathSegments[pathSegments.length - 1].anchor = true;
    else {
      pathSegments.push({ x, y, anchor: false });
      last = [x, y];
    }
  }
  return pathSegments;
}

