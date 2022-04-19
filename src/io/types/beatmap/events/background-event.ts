export interface BeatmapBackgroundEvent {
  type: "background";
  time: number;
  filename: string;
  x: number;
  y: number;
}
