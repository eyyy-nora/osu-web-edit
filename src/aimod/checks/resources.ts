import { Mapset, Beatmap } from "src/io";
import { backgroundNotPresentIssue, Issue } from "../issue-templates";

export function checkBackgroundPresence(mapsetFiles: Mapset["files"], events: Beatmap["events"], issues: Issue[]) {
  for (const event of events) {
    if (event.type === "break" || event.type === "video") return;

    // todo: See why the '"' is being added to this string
    if (!mapsetFiles[event.filename.replaceAll('"', '')])
      issues.push(backgroundNotPresentIssue());
  }
}
