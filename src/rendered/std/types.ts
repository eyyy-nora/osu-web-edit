import { BeatmapObjectWithCombo } from "src/context";
import { BeatmapObjectBase } from "src/io";

export type BeatmapObjectWithStdProps = BeatmapObjectBase & BeatmapObjectWithCombo & {
  complete: boolean;
  alpha: number;
  approach: number;
  percent: number;
  zIndex: number;
};
