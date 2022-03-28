
export interface BeatmapObjectBase {
  type: string;
  start: number;
  end?: number;
}

export interface WithPosition {
  position: { x: number; y: number };
}

export interface WithRotation {
  rotation: number;
}

export interface WithBeatLength {
  beats: number;
}

export interface WithVelocity {
  velocity: number | [number, number][];
}

export interface WithChildren<T extends BeatmapObject = BeatmapObject> {
  children: T[];
}

export interface HitCircle extends BeatmapObjectBase, WithPosition { type: "circle" }
export interface HoldCircle extends BeatmapObjectBase, WithPosition, WithBeatLength { type: "hold" }
export interface Slider extends BeatmapObjectBase, WithPosition, WithBeatLength, WithVelocity { type: "slider" }
export interface HitCircleStream extends BeatmapObjectBase, WithPosition, WithBeatLength, WithVelocity, WithChildren<HitCircle> { type: "circle-stream" }
export interface SliderStream extends BeatmapObjectBase, WithPosition, WithBeatLength, WithVelocity, WithChildren<Slider> { type: "slider-stream" }
export type BeatmapObject = HitCircle | HoldCircle | HitCircleStream | Slider | SliderStream;

export interface BeatmapContext {

}
