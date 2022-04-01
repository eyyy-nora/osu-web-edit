export interface ParsedBeatmap {
  General: {
    AudioFilename: string;
    AudioLeadIn: number;
    PreviewTime: number;
    CountDown: number;
    SampleSet: string;
    StackLaniency: number;
    Mode: number;
    LetterboxInBreaks: number;
    EpilepsyWarning: number;
    WidescreenStoryboard: number;
  };

  Editor: {
    Bookmarks: number[];
    DistanceSpacing: number;
    BeatDivisor: number;
    GridSize: number;
    TimelineZoom: number;
  };

  Metadata: {
    Title: string;
    TitleUnicode: string;
    Artist: string;
    ArtistUnicode: string;
    Creator: string;
    Version: string;
    Source: string;
    // Tags could be an string array
    Tags: string;
    BeatmapID: number;
    BeatmapSetID: number;
  };

  Difficulty: {
    ApproachRate: number;
    CircleSize: number;
    HPDrainRate: number;
    OverallDifficulty: number;
    SliderMultiplier: number;
    SliderTickRate: number;
  };

  Events: ParsedEvent[];
  TimingPoints: ParsedTimingPoint[];
  Colours: ParsedOsuColors;
  HitObjects: ParsedHitObject[];

}

export interface ParsedOsuColors {
  [index: `Combo${number}`]: [number, number, number];
  BackgroundColor: [number, number, number];
}

export interface ParsedHitSamples {
  normalSet: number;
  additionalSet: number;
  index: number;
  volume: number;
  filename?: string;
}

export interface ParsedPoint {
  x: number;
  y: number;
  anchor: boolean;
}

export interface HitObjectBase {
  x: number;
  y: number;
  time: number;
  hitSound: number;
  hitSample: ParsedHitSamples;
  skipColors: number;
  newCombo: boolean;
}

export interface ParsedHitCircle extends HitObjectBase {
  type: "circle";
}

export interface ParsedSliderBase extends HitObjectBase {
  type: "slider";
  slides: number;
  length: number;
  edgeSounds: number[];
  edgeSets: string[];
}

export interface ParsedLinearSlider extends ParsedSliderBase {
  sliderType: "linear";
  pathSegments: ParsedPoint[];
}

export interface ParsedPerfectCircleSlider extends ParsedSliderBase {
  sliderType: "circle";
  pathSegments: [ParsedPoint, ParsedPoint];
}

export interface ParsedBezierSlider extends ParsedSliderBase {
  sliderType: "bezier";
  pathSegments: ParsedPoint[];
}

export interface ParsedCatmullSlider extends ParsedSliderBase {
  sliderType: "catmull";
  pathSegments: ParsedPoint[];
}

export type ParsedSlider = ParsedLinearSlider | ParsedPerfectCircleSlider | ParsedBezierSlider | ParsedCatmullSlider;

export interface ParsedSpinner extends HitObjectBase {
  type: "spinner";
  end: number;
  x: 256;
  y: 192;
}

export interface ParsedHold extends HitObjectBase {
  type: "hold";
  end: number;
  y: 192;
}

export type ParsedHitObject = ParsedHitCircle | ParsedSlider | ParsedSpinner | ParsedHold;

export interface ParsedBackgroundEvent {
  type: "background";
  time: number;
  filename: string;
  x: number;
  y: number;
}

export interface ParsedVideoEvent {
  type: "video";
  time: number;
  filename: string;
  x: number;
  y: number;
}

export interface  ParsedBreakEvent {
  type: "break";
  time: number;
  end: number;
}

export type ParsedEvent = ParsedBackgroundEvent | ParsedVideoEvent | ParsedBreakEvent;

export interface ParsedTimingPoint {
  time: number;
  beatLength: number;
  meter: number;
  sampleSet: number;
  sampleIndex: number;
  volume: number;
  inherited: boolean;
  kiai: boolean;
  omitFirstBarLine: boolean;
}

export interface ParsedMapSet {
  difficulties: ParsedBeatmap[];
  files: Record<string, Blob>;
}
