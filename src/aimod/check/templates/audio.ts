import { Beatmap, BeatmapObject } from "src/io";
import { issueTemplater } from "./issue-template";
import { openFileDialog } from "src/util/open-file-dialog";

export function invalidAudioFileIssue(file: Beatmap["general"]["audioFilename"]): Object {
  const issue = issueTemplater("invalid_audio_format", "Audio", "Warning");

  issue["message"] = `Invalid audio format '${getFileExtension(file)}'. Osu can't understand this audio format.`;
  issue["onclick"] = () => {
    // maybe automatically convert it?
  }

  return issue;
}

export function audioIsLongerThanTheMappedPartIssue(): Object {
  const issue = issueTemplater("audio_is_longer_than_mapped_part", "Audio", "Warning");

  issue["message"] = `Your map does not cover at least 25% of the song's length.`;

  return issue;
}

export function volumeMutedIssue(hitObject: BeatmapObject): Object {
  const { time, type, hitSample: { volume } } = hitObject;

  const issue = issueTemplater("muted_hit_object", "Audio", "Problem");

  issue["message"] = `A ${type} has a volume of ${volume}. Hit objects must have a audible feedback.`;
  issue["time"] = time;
  issue["onclick"] = () => {
    // Change the timeline location to the issue location.
  }

  return issue;
}

export function lowVolumeIssue(hitObject: BeatmapObject): Object {
  const { time, type, hitSample: { volume } } = hitObject;

  const issue = issueTemplater("volume_low_hit_object", "Audio", "Warning");

  issue["message"] = `A ${type} has a volume of ${volume}. Make sure that the hit object is audible.`;
  issue["time"] = time;
  issue["onclick"] = () => {
    // Change the timeline location to the issue location.
  }

  return issue;
}

export function audioNotPresentIssue(audioFile: Beatmap["general"]["audioFilename"]): Object {

  const issue = issueTemplater("audio_not_present", "Audio", "Problem");

  issue["message"] = `The appointed audio file '${audioFile}' was not found in the beatmap directory.`;
  issue["onclick"] = () => {
    // Open import file prompt to import audio.
    openFileDialog();
  }

  return issue;
}



function getFileExtension(file: string): string {
  return file.split(".").pop();
}
