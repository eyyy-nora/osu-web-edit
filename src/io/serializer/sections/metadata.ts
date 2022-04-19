import { BeatmapMetadataSection } from "../../types";
import { pascal } from "../util";

export function serializeMetadataSection(metadata: BeatmapMetadataSection): string {
  const lines: string[] = ["[Metadata]"];

  for (const [key, value] of Object.entries(metadata)) {
    let line: string;

    // noinspection FallThroughInSwitchStatementJS
    switch (key) {
      case "tags": line = `tags: ${(value as string[]).join(" ")}`; break;
      case "beatmapID":
      case "beatmapSetID":
        if (!value) continue;
      default:     line = `${pascal(key)}: ${value}`;
    }

    lines.push(line);
  }

  return lines.join("\n");
}
