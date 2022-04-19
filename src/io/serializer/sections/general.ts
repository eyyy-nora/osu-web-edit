import { BeatmapGeneralSection } from "../../types";
import { countdowns, modes, overlayPositions } from "../../constants";
import { pascal, reverseLookup, serializeConfigValue } from "../util";



export function serializeGeneralSection(general: BeatmapGeneralSection): string {
  const lines: string[] = ["[General]"];

  for (const [key, value] of Object.entries(general)) {
    let line: string;

    switch (key) {
      case "sampleSet":       line = `SampleSet: ${pascal(value)}`; break;
      case "countdown":       line = `Countdown: ${reverseLookup(countdowns, value, "0")}`; break;
      case "mode":            line = `Mode: ${reverseLookup(modes, value, "0")}`; break;
      case "overlayPosition": line = `OverlayPosition: ${reverseLookup(overlayPositions, value, "NoChange")}`; break;
      default:                line = `${pascal(key)}: ${serializeConfigValue(value)}`;
    }

    lines.push(line);
  }

  return lines.join("\n");
}
