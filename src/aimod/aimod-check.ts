import { Beatmap, Mapset } from "src/io";
import {
  checkAudioPresence, checkBackgroundPresence, checkConcurrentObjects,
  checkInvalidAudioType, checkMutedOrLow, checkAudioIsLongerThanMap
} from "./checks";

export function runAIMod(analyzedBeatmap: Beatmap, beatmapFolder: Mapset["files"], beatmapAudio: HTMLAudioElement) {
  const { general, events, layers } = analyzedBeatmap;
  const objects = layers[0].objects;

  const issues = [];

  checkAudioPresence(beatmapFolder, general, issues);
  checkBackgroundPresence(beatmapFolder, events, issues);

  checkInvalidAudioType(general, issues);

  checkAudioIsLongerThanMap(objects, beatmapAudio, issues);

  for (const hitObject of objects) {
    let nextHitObject = objects[objects.indexOf(hitObject) + 1];

    checkConcurrentObjects(hitObject, nextHitObject, issues);

    // todo: Add checks for hit objects volume when that feature is implemented.
  }

  return issues;
}

