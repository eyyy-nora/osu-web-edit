import { Beatmap, Mapset } from "src/io";
import {
  checkAudioPresence, checkBackgroundPresence, checkConcurrentObjects,
  checkInvalidAudioType, checkMutedOrLow
} from "./check";

export function runAIMod(analyzedBeatmap: Beatmap, beatmapFolder: Mapset["files"]) {
  const { objects, general, events } = analyzedBeatmap;
  const issues = [];

  checkAudioPresence(beatmapFolder, general, issues);
  checkBackgroundPresence(beatmapFolder, events, issues);

  checkInvalidAudioType(general, issues);

  for (const hitObject of objects) {
    let nextHitObject = objects[objects.indexOf(hitObject) + 1];

    checkConcurrentObjects(hitObject, nextHitObject, issues);

    // todo: Add checks for hit objects volume when that feature is implemented.
  }

  return issues;
}

