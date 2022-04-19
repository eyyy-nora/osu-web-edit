import { BeatmapEditorSection } from "../../types";
import { pascal } from "../util";

export function serializeEditorSection(metadata: BeatmapEditorSection): string {
  const lines: string[] = ["[Editor]"];

  for (const [key, value] of Object.entries(metadata)) {
    let line: string;

    switch (key) {
      case "bookmarks": line = `Bookmarks: ${(value as number[]).join(",")}`; break;
      default:          line = `${pascal(key)}: ${value}`;
    }

    lines.push(line);
  }

  return lines.join("\n");
}
