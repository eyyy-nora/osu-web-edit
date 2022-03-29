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
  
    Events: string[];
    TimingPoints: string[];
    Colours: string[];
    HitObjects: string[];
  
};

export interface HitObject {
  x: number;
  y: number;
  SliderAnchors?: string[];
  Time: number;
  Type: number;
  HitSound: number;
  ObjectParameters: number;
  HitSample: string;
};