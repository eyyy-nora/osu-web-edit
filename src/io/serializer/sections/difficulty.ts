import { BeatmapDifficultySection } from "../../types";
import { pascal } from "../util";

export function serializeDifficultySection(difficulty: BeatmapDifficultySection): string {
  const lines: string[] = ["[Difficulty]"];

  for (const [key, value] of Object.entries(difficulty)) {
    let line: string;

    switch (key) {
      case "hpDrainRate": line = `HPDrainRate: ${value}`; break;
      default:     line = `${pascal(key)}: ${value}`;
    }

    lines.push(line);
  }

  return lines.join("\n");
}
