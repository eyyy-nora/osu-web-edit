import { Beatmap } from "./types";



export const beatmapDefaults = (): Beatmap => ({
  general: {
    audioFilename: "",
    audioLeadIn: 0,
    previewTime: -1,
    countdown: "normal",
    sampleSet: "normal",
    stackLeniency: .7,
    mode: "osu",
    letterboxInBreaks: false,
    storyFireInFront: true,
    useSkinSprites: false,
    alwaysShowPlayfield: false,
    overlayPosition: "no-change",
    skinPreference: "",
    epilepsyWarning: false,
    countdownOffset: 0,
    specialStyle: false,
    widescreenStoryboard: false,
    samplesMatchPlaybackRate: false,
  },
  editor: {
    bookmarks: [],
    distanceSpacing: 1,
    beatDivisor: 4,
    gridSize: 1,
    timelineZoom: 1,
  },
  metadata: {
    title: "",
    titleUnicode: "",
    artist: "",
    artistUnicode: "",
    creator: "",
    version: "",
    source: "",
    tags: [],
  },
  difficulty: {
    hpDrainRate: 4,
    circleSize: 4,
    overallDifficulty: 6,
    approachRate: 9,
    sliderMultiplier: 2,
    sliderTickRate: 1,
  },
  colors: {
    colors: [],
  },
  timingPoints: [],
  events: [],
  objects: []
});

export const mappedSections: Record<string, keyof Beatmap> = {
  General: "general",
  Editor: "editor",
  Metadata: "metadata",
  Difficulty: "difficulty",
  Events: "events",
  TimingPoints: "timingPoints",
  HitObjects: "objects",
  Colours: "colors",
};

export const bitmasks = {
  circle: 1,
  slider: 2,
  spinner: 8,
  hold: 128,
  newCombo: 4,
  skipColors: 16 | 32 | 64,
  kiai: 1,
  omitFirstBarLine: 8,
};

export const sampleSets = {
  0: "default",
  1: "normal",
  2: "soft",
  3: "drum",
} as const;

export const countdowns = {
  0: "none",
  1: "normal",
  2: "half",
  3: "double",
} as const;

export const modes = {
  0: "osu",
  1: "taiko",
  2: "ctb",
  3: "mania",
} as const;

export const overlayPositions = {
  NoChange: "no-change",
  Above: "above",
  Below: "below",
} as const;

export const sliderTypes = {
  "L": "linear",
  "P": "circle",
  "B": "bezier",
  "C": "catmull",
} as const;
