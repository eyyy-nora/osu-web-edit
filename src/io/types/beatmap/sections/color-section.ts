export interface BeatmapColorSection {
  colors: BeatmapColor[];
  backgroundColor?: BeatmapColor;
  sliderTrackOverride?: BeatmapColor;
  sliderBorder?: BeatmapColor;
}

export type BeatmapColor = [red: number, green: number, blue: number];
