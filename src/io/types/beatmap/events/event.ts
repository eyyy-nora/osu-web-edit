import { BeatmapBackgroundEvent } from "./background-event";
import { BeatmapBreakEvent } from "./break-event";
import { BeatmapVideoEvent } from "./video-event";

export type BeatmapEvent = BeatmapBackgroundEvent | BeatmapBreakEvent | BeatmapVideoEvent;
