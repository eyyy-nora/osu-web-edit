import { BeatmapObject } from "src/io"
import { issueTemplater } from "./issue-templater"

export function concurrencyIssue(hitObject: BeatmapObject, nextHitObject: BeatmapObject): Object {
  const { time } = hitObject

  const issue = issueTemplater("object_concurrency", "Compose", "Problem");

  issue["time"] = time;
  issue["message"] = `A ${hitObject.type} is concurrent to a ${nextHitObject.type}.`;
  issue["onclick"] = () => {
    // Change the timeline to the issue location.
  }

  return issue;
}
