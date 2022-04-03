import { Point } from "pixi.js";
import { ParsedSlider, ParsedPoint } from "../parse/types";
import { lerp } from "./numbers";


const linearSubdivision = 5;
const catmullSubdivision = 50;

const precisionThresholdPx = 0.01;

const arcParallelThreshold = 0.00001;

const curvePointsSeperation = 5;

/* Ticks closer to the end time of the slider than this are not generated.
 * Value: https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/SliderEventGenerator.cs#L24 */
const tickCutoffMs = 10;

/* The tick for sliderend judgement is offset backwards in time by this amount
 * unless the slider is particularly short.
 *
 * Value: https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertSlider.cs#L52
 * Usage: https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/SliderEventGenerator.cs#L79 */
const endTickOffsetMs = 36;


export function sliderPath(slider: ParsedSlider, cs: number, percent: number): [Point, Point, Point] {
  if(slider.sliderType === "linear") {
    return linearPath(slider.pathSegments, cs, percent);
  } else if(slider.sliderType === "circle") {
    return circlePath(slider.pathSegments, cs, percent);
  } else if(slider.sliderType === "bezier") {
    return bezierPath(slider.pathSegments, cs, percent);
  } else if(slider.sliderType === "catmull") {
    return catmullPath(slider.pathSegments, cs, percent);
  }

  // else error?
  return [
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
  ];
}

function linearPath(segments: ParsedPoint[], cs: number, percent: number): [Point, Point, Point] {
  const segment = segments[0];
  const nextSegment = segments[1];

  const outerL = {
    x: lerp(segment.x, nextSegment.x, percent),
    y: lerp(segment.y, nextSegment.y, percent)
  } as Point;

  const center = {
    x: lerp(segment.x, nextSegment.x, percent),
    y: lerp(segment.y, nextSegment.y, percent)
  } as Point;

  const outerR = {
    x: lerp(segment.x, nextSegment.x, percent),
    y: lerp(segment.y, nextSegment.y, percent)
  } as Point;

  return [outerL, center, outerR];
}

function circlePath(segments: [ParsedPoint, ParsedPoint], cs: number, percent: number): [Point, Point, Point] {
  
  
  return [
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
  ];
}

function bezierPath(segments: ParsedPoint[], cs: number, percent: number): [Point, Point, Point] {


  return [
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
  ];
}

function catmullPath(segments: ParsedPoint[], cs: number, percent: number): [Point, Point, Point] {

  return [
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
    {x:0, y:0} as Point,
  ];
}

function catmullFindPoint(ps: number[], t: number): number {
  // https://github.com/ppy/osu-framework/blob/050a0b8639c9bd723100288a53923547ce87d487/osu.Framework/Utils/PathApproximator.cs#L449
  let t2 = t * t;
  let t3 = t2 * t;

  return 0.5 * (
    (2 * ps[1])
    + (ps[2] - ps[0]) * t
    + (2 * ps[0] - 5 * ps[1] + 4 * ps[2] - ps[3]) * t2
    + (ps[3] - 3 * ps[2] + 3 * ps[1] - ps[0]) * t3
  );
}
