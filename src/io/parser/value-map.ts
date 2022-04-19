import {
  BeatmapDifficultySection,
  BeatmapEditorSection,
  BeatmapGeneralSection, BeatmapMetadataSection
} from "../types";
import {
  countdowns,
  modes,
  overlayPositions,
  sampleSets
} from "../constants";



const maybeNumber = (str: string) => str ? Number(str) : undefined;
const maybeBoolean = (str: string) => str ? str === "1" : undefined;

export const valueMap: Partial<Record<
  keyof (BeatmapGeneralSection & BeatmapEditorSection & BeatmapDifficultySection & BeatmapMetadataSection),
  (str: string) => any
  >> = {
  sliderTickRate: maybeNumber,
  sliderMultiplier: maybeNumber,
  approachRate: maybeNumber,
  overallDifficulty: maybeNumber,
  circleSize: maybeNumber,
  hpDrainRate: maybeNumber,
  beatmapId: maybeNumber,
  timelineZoom: maybeNumber,
  gridSize: maybeNumber,
  beatDivisor: maybeNumber,
  distanceSpacing: maybeNumber,
  bookmarks: str => !str ? []: str.split(",").map(Number),
  sampleSet: set => sampleSets[set],
  countdownOffset: maybeNumber,
  previewTime: maybeNumber,
  stackLeniency: maybeNumber,
  audioLeadIn: maybeNumber,
  samplesMatchPlaybackRate: maybeBoolean,
  widescreenStoryboard: maybeBoolean,
  specialStyle: maybeBoolean,
  epilepsyWarning: maybeBoolean,
  alwaysShowPlayfield: maybeBoolean,
  useSkinSprites: maybeBoolean,
  storyFireInFront: maybeBoolean,
  letterboxInBreaks: maybeBoolean,
  beatmapSetId: maybeNumber,
  countdown: str => str ? countdowns[str] : "normal",
  mode: str => str ? modes[str] : "osu",
  tags: str => str ? str.split(/ +/g) : [],
  overlayPosition: str => str ? overlayPositions[str] : "no-change",
};
