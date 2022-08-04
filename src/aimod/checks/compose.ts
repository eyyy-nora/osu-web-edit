import { BeatmapObject } from "src/io";
import { concurrencyIssue, Issue } from "../issue-templates";

export function checkConcurrentObjects(currentHitObject: BeatmapObject, nextHitObject: BeatmapObject, issues: Issue[]) {
  if (areConcurrent(currentHitObject, nextHitObject)) {
    issues.push(concurrencyIssue(currentHitObject, nextHitObject));
  }
}



function getHitObjectEnd(hitObject: BeatmapObject) {
  if (!hitObject) return;

  if (hitObject.type === "spinner" || hitObject.type === "hold") return hitObject.end;
  else return hitObject.time;
}

function areConcurrent(currentHitObject: BeatmapObject, nextHitObject: BeatmapObject) {
  if (!currentHitObject || !nextHitObject) return;

  let currentObjectEnd = getHitObjectEnd(currentHitObject);
  let nextObjectEnd = getHitObjectEnd(nextHitObject);

  return currentObjectEnd === nextObjectEnd;
}
