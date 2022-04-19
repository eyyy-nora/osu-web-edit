import {
  BeatmapCountdown,
  BeatmapGameMode,
  BeatmapOverlayPosition,
  BeatmapSampleSet
} from "src/io/types/beatmap/sections/enums";

export interface BeatmapGeneralSection {
  audioFilename: string;
  audioLeadIn: number;
  /** @deprecated */
  audioHash?: string;
  previewTime: number;
  countdown: BeatmapCountdown;
  sampleSet: BeatmapSampleSet;
  stackLeniency: number;
  mode: BeatmapGameMode;
  letterboxInBreaks: boolean;
  /** @deprecated */
  storyFireInFront?: boolean;
  useSkinSprites: boolean;
  /** @deprecated */
  alwaysShowPlayfield?: boolean;
  overlayPosition: BeatmapOverlayPosition;
  skinPreference: string;
  epilepsyWarning: boolean;
  countdownOffset: number;
  specialStyle: boolean;
  widescreenStoryboard: boolean;
  samplesMatchPlaybackRate: boolean;
}
