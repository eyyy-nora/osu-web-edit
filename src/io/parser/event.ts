import { BeatmapEvent } from "../types";

export function parseOsuEvent(line: string): BeatmapEvent {
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
