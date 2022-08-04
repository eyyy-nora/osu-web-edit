import { Beatmap, BeatmapObject } from "src/io";
import { Issue } from "./issue";
import { openFileDialog } from "src/util/open-file-dialog";

const audioIssue = (cfg: Partial<Issue> & { message: string; error: string }): Issue => ({
  category: "Audio",
  type: "Warning",
  ...cfg,
})


export function invalidAudioFileIssue(file: Beatmap["general"]["audioFilename"]) {
  return audioIssue({
    error: "Invalid audio format",
    message: `Invalid audio format '${getFileExtension(file)}'. Osu can't understand this audio format.`,
    apply(context) {
      // do whatever here with the context
    }
  });
}

export function audioIsLongerThanMapIssue() {
  return audioIssue({
    error: "Audio is longer than map",
    message: `Your map does not cover at least 25% of the song's length.`,
    apply(context) {
      // do whatever here with the context
    },
  });
}

export function volumeMutedIssue(hitObject: BeatmapObject) {
  const { time, type, hitSample: { volume } } = hitObject;

  return audioIssue({
    error: "Muted hit object",
    type: "Problem",
    message: `A ${type} has a volume of ${volume}. Hit objects must have a audible feedback.`,
    apply(context) {
      context.goto(time);
    },
  });
}

export function lowVolumeIssue(hitObject: BeatmapObject) {
  const { time, type, hitSample: { volume } } = hitObject;

  return audioIssue({
    error: "Volume low",
    message: `A ${type} has a volume of ${volume}. Make sure that the hit object is audible.`,
    apply(context) {
      context.goto(time);
    },
  });
}

export function audioNotPresentIssue(audioFile: Beatmap["general"]["audioFilename"]) {
  return audioIssue({
    error: "Audio not present",
    type: "Problem",
    message: `The appointed audio file '${audioFile}' was not found in the beatmap directory.`,
    apply(context) {
      openFileDialog();
    }
  });
}



function getFileExtension(file: string) {
  return file.split(".").pop();
}
