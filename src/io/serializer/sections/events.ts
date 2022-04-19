import { BeatmapEvent } from "../../types";



export function serializeEventSection(events: BeatmapEvent[]): string {
  return [
    "[Events]",
    "//Background and Video events",
    ...events
      .filter(event => event.type === "background" || event.type === "video")
      .map(serializeBeatmapEvent),
    "//Break Points",
    ...events
      .filter(event => event.type === "break")
      .map(serializeBeatmapEvent),
    "//Storyboard Layer 0 (Background)",
    "//Storyboard Layer 1 (Fail)",
    "//Storyboard Layer 2 (Pass)",
    "//Storyboard Layer 3 (Foreground)",
    "//Storyboard Layer 4 (Overlay)",
    "//Storyboard Sound Samples",
  ].join("\n");
}

export function serializeBeatmapEvent(event: BeatmapEvent): string {
  switch (event.type) {
    case "break": return `2,${event.time},${event.end}`;
    case "background": return `0,${event.time ?? 0},${event.filename},${event.x},${event.y}`;
    case "video": return `1,${event.time ?? 0},${event.filename},${event.x},${event.y}`;
  }
}
