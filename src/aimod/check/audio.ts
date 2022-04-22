import { Mapset, Beatmap, BeatmapObject } from "src/io";
import {
  audioNotPresentIssue, volumeMutedIssue,
  lowVolumeIssue, invalidAudioFileIssue
} from "./templates";

export function checkAudioPresence(mapsetFiles: Mapset["files"], general: Beatmap["general"], issues: any[]) {
  if (!mapsetFiles[general.audioFilename])
    issues.push(audioNotPresentIssue(general.audioFilename));
}

export function checkMutedOrLow(currentHitObject: BeatmapObject, issues: any[]) {
  const { hitSample } = currentHitObject;

  if (!hitSample) return;

  // Objects with hitsound this low could be considered muted.
  if (hitSample.volume <= 5)
    issues.push(volumeMutedIssue(currentHitObject));

  // This threshold could be considered muted, but depending on the situation it's not.
  // So we just throw a warning instead of a problem.
  if (hitSample.volume <= 20)
    issues.push(lowVolumeIssue(currentHitObject));
}

export function checkInvalidAudioType(general: Beatmap["general"], issues: any[]) {
  if (isInvalidAudioFormat(general.audioFilename))
    issues.push(invalidAudioFileIssue(general.audioFilename));
}



function isInvalidAudioFormat(audioFile: string): boolean {
  return !(
    audioFile.endsWith(".mp3") || audioFile.endsWith(".wav") || audioFile.endsWith(".ogg")
  );
}
