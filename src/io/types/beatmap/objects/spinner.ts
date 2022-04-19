import { BeatmapObjectBase } from "./base";

export interface BeatmapSpinner extends BeatmapObjectBase {
  type: "spinner";
  end: number;
  x: 256;
  y: 192;
}
