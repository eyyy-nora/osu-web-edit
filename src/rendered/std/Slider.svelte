<script lang="ts" context="module">
import { Bezier } from "bezier-js";
import { CapsStyle, GameObject, Graphics, JointStyle } from "black-engine";
import { BeatmapSlider, BeatmapSliderPoint, BeatmapSliderType } from "src/io";
import {
  borderWidthFactor,
  radiusForCs,
  sliderBallColor,
  sliderBallWidthFactor,
  sliderBodyColor,
  sliderBorderColor
} from "src/rendered/std/general";
import { clamp, lerp } from "src/util/numbers";
import { BeatmapCircleObject } from "./HitCircle.svelte";
import { CurveBase2d, Line2d, Bezier2d, Catmull2d, PolyCurve2d, Arc2d } from "@rdme/curve-2d";
import { BeatmapObjectWithStdProps } from "./types";

const { sqrt, pow } = Math;



export class BeatmapSliderObject extends GameObject {
  sliderObj: BeatmapSlider & BeatmapObjectWithStdProps;
  hitCircle: BeatmapCircleObject;
  g: Graphics;
  zIndex: number;

  prevSliderObj: BeatmapSlider & BeatmapObjectWithStdProps;
  curve: CurveBase2d;

  constructor(slider: BeatmapSlider & BeatmapObjectWithStdProps) {
    super();
    this.sliderObj = slider;
    this.zIndex = slider.zIndex;
  }

  public onAdded() {
    this.g = new Graphics();
    this.hitCircle = new BeatmapCircleObject(this.sliderObj);
    this.addChild(this.g);
    this.addChild(this.hitCircle as any);
  }

  protected onUpdate() {
    const { sliderObj: slider, g, hitCircle } = this;
    const { x, y, slides, zIndex, alpha, percent, cs } = slider;
    (hitCircle as any).circleObj = slider;
    this.zIndex = zIndex;
    const r = radiusForCs(cs);

    if (this.sliderDirty) this.curve = this.getSliderCurve();
    const curve = this.curve;
    const lut = curve.getLut();

    g.clear();
    g.x = x;
    g.y = y;

    // slider body outline
    g.lineStyle(r * 2, sliderBorderColor, alpha * .6, (CapsStyle as any).ROUND, (JointStyle as any).ROUND);
    g.beginPath();
    for (const { x, y } of lut) g.lineTo(x, y);
    g.stroke();

    // slider body fill
    g.lineStyle((r - (r * borderWidthFactor)) * 2, sliderBodyColor, alpha * .6, (CapsStyle as any).ROUND, (JointStyle as any).ROUND);
    g.beginPath();
    for (const { x, y } of lut) g.lineTo(x, y);
    g.stroke();

    if (percent > 0 && percent < 1) {
      const total = percent * slides;
      const current = Math.floor(total);
      const backward = !!(current % 2);
      const partial = backward ? 1 - (total - current) : total - current;
      const ballPos = curve.getByPercent(partial);
      const remaining = slides - (current + 1);

      // slider ball
      g.lineStyle(r * sliderBallWidthFactor, sliderBallColor, alpha);
      g.beginPath();
      g.circle(ballPos.x, ballPos.y, r - r * (sliderBallWidthFactor + borderWidthFactor) / 2);
      g.stroke();

      // return arrow 1
      if (remaining > 0) {
        g.lineStyle(r * sliderBallWidthFactor, 0xffffff, alpha);
        g.beginPath();
        const pos = curve.get(backward ? 0 : 1);
        g.circle(pos.x, pos.y, r - r * (sliderBallWidthFactor + borderWidthFactor) * 2);
        g.stroke();

        if (remaining > 1) {
          g.beginPath();
          const pos = curve.get(backward ? 1 : 0);
          g.circle(pos.x, pos.y, r - r * (sliderBallWidthFactor + borderWidthFactor) * 2);
          g.stroke();
        }
      }
    }
    // todo: slides

  }

  get sliderDirty() {
    const { prevSliderObj, sliderObj } = this;
    if (!prevSliderObj) return true;
    return (
      prevSliderObj.sliderType !== sliderObj.sliderType
      || prevSliderObj.path !== sliderObj.path
      || prevSliderObj.x !== sliderObj.x
      || prevSliderObj.y !== sliderObj.y
      || prevSliderObj.sv !== sliderObj.sv
    );
  }

  getSliderCurve() {
    const slider = this.sliderObj;
    const { sliderType, path } = slider;
    switch(sliderType) {
      case "linear":
        return new PolyCurve2d(this.pairs.map(([a, b]) => new Line2d(a, b)));
      case "catmull":
        return Catmull2d.fromPointsOnCurve(this.offsetPoints);
      case "bezier":
        return new PolyCurve2d(this.segments.map(points => new Bezier2d(points)));
      case "circle":
        if (path.length === 1) return new Line2d(slider, path[0]);
        if (path.length > 2) return new Bezier2d([slider, ...path]);
        return Arc2d.fromPoints(...this.offsetPoints);
    }
  }

  calculateLut() {
    this.prevSliderObj = { ...this.sliderObj } as any;
    const { sliderType, path } = this.sliderObj;
    switch (sliderType) {
      case "bezier": return this.calculateBezierLut();
      case "catmull": return this.calculateCatmullLut();
      case "linear": return this.calculateLinearLut();
      case "circle":
        if (path.length === 1) return this.calculateLinearLut();
        if (path.length > 2) return this.calculateBezierLut();
        return this.calculateCircleLut();
    }
  }

  calculateBezierLut() {
    const length = this.sliderLength;
    const segments = this.bezierSegments;
    const lengths = segments.map(segment => segment.length());
    this.lut = segments.flatMap((segment) => segment.getLUT(clamp(segment.length() / 5, 2, 50)));
    this.pathAt = (percent) => {
      const [index, remaining] = this.remainingSegmentsAndLength(lengths, length * percent);
      if (index === -1) return { x: 0, y: 0 };
      const segment = segments[index];
      return segment.get(segment.atPercent(remaining));
    };
  }

  calculateCatmullLut() {
    // todo: catmul
  }

  calculateLinearLut() {
    let length = this.sliderLength;
    console.log(length);
    const pairs = this.linearSegments;
    const lengths = pairs.map(([a, b]) => sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2)));
    this.lut = [{ x: 0, y: 0 }, ...pairs.map(([, end]) => end)];
    this.pathAt = (percent) => {
      const [index, remaining] = this.remainingSegmentsAndLength(lengths, length * percent);
      const [a, b] = pairs[index];
      return this.lerpVectors(a, b, remaining);
    }
  }

  calculateCircleLut() {
    // todo: circle
  }

  remainingSegmentsAndLength(lengths: number[], length = this.sliderObj.length): [index: number, percent: number] {
    for (let i = 0; i < lengths.length; ++i) {
      if (length === 0) return [i, 0];
      if (length < lengths[i]) return [i, length / lengths[i]];
      length -= lengths[i];
    }
    return [lengths.length - 1, 1];
  }

  get offsetPoints(): BeatmapSliderPoint[] {
    const { x: offsetX, y: offsetY, path } = this.sliderObj;
    const points = path.map(({ x, y, anchor }) => ({
      x: x - offsetX,
      y: y - offsetY,
      anchor,
    }));
    points.unshift({ x: 0, y: 0, anchor: false });
    return points;
  }

  get pairs(): [{ x: number; y: number }, { x: number; y: number }][] {
    const points = this.offsetPoints;
    if (points.length < 2) throw new Error("Linear slider with just one point?");
    if (points.length === 2) return [points];
    const result: [{ x: number; y: number }, { x: number; y: number }][] = Array(points.length - 1);
    for (let i = 1; i < points.length; ++i)
      result[i - 1] = [points[i - 1], points[i]];
    return result;
  }

  get linearSegments(): [{ x: number; y: number }, { x: number; y: number }][] {
    const pairs = this.pairs;
    const lengths = pairs.map(([a, b]) => sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2)));
    const [index, remaining] = this.remainingSegmentsAndLength(lengths);
    const [a, b] = pairs[index];
    const end = [a, this.lerpVectors(a, b, remaining)];
    return [...pairs.slice(0, index - 1), end]
  }

  lerpVectors(a: { x: number; y: number }, b: { x: number; y: number }, percent: number) {
    return {
      x: lerp(a.x, b.x, percent),
      y: lerp(a.y, b.y, percent),
    };
  }

  get segments(): BeatmapSliderPoint[][] {
    const points = this.offsetPoints;
    if (!points.length) return [];
    let current: BeatmapSliderPoint[] = [];
    const results: BeatmapSliderPoint[][] = [];
    for (const point of points) {
      if (point.anchor && current.length > 0) {
        current.push(point);
        results.push(current);
        current = [];
      }
      current.push(point);
    }
    if (current.length > 1) results.push(current);
    return results;
  }

  get bezierSegments(): Bezier[] {
    // return this.segments.map(segment => new Bezier(segment));
    // todo: in theory this should work -- why isn't it ???
    // xxx: turns out bezier-js doesn't handle splitting for beziers of
    // xxx: higher order than 3 (cubic). so time to make my own...
    // *
    const segments = this.segments.map(segment => new Bezier(segment));
    const lengths = segments.map(segment => segment.length());
    const [index, percent] = this.remainingSegmentsAndLength(lengths);
    const tVal = segments[index].atPercent(percent);
    if (tVal === 0) return segments.slice(0, index - 1);
    if (tVal === 1) return segments.slice(0, index);
    return [...segments.slice(0, index - 1), segments[index].split(tVal).left];
    // */
  }

  get sliderLength() {
    const { sv, length, beatLength } = this.sliderObj;
    return sv * length;
  }

}

</script>
<script lang="ts">
import { addBlackChild } from "src/context";

export let slider: BeatmapSlider & BeatmapObjectWithStdProps = {};
export const gameObj = new BeatmapSliderObject(slider as any);

$: gameObj.sliderObj = slider as any;

addBlackChild(gameObj as any);
</script>
