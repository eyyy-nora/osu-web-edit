import { BeatmapObjectBase } from "./base";

export interface BeatmapHold extends BeatmapObjectBase {
  type: "hold";
  end: number;
  y: 192;
}
