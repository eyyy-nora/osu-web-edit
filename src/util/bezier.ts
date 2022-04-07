import { Point } from "pixi.js";
import { ParsedSlider, ParsedPoint } from "../parse/types";
import { lerp, intersect_slope, rot90 } from "./numbers";
import { Vector2 } from "./Vector2";


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


export function sliderPathAt(slider: ParsedSlider, cs: number, percent: number): [Point, Point, Point] {
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

  const posC = {
    x: lerp(segment.x, nextSegment.x, percent),
    y: lerp(segment.y, nextSegment.y, percent)
  } as Point;

  const posL = {
    x: lerp(segment.x, nextSegment.x, percent),
    y: lerp(segment.y, nextSegment.y, percent)
  } as Point;

  const posR = {
    x: lerp(segment.x, nextSegment.x, percent),
    y: lerp(segment.y, nextSegment.y, percent)
  } as Point;

  return [posL, posC, posR];
}

/* Demonstration of the algorithm: https://www.desmos.com/calculator/se3jth7qy9 */
function circlePath(segments: ParsedPoint[], cs: number, percent: number): [Point, Point, Point] {
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L316
  if(segments.length != 3) {
    return bezierPath(segments, cs, percent);
  }

  const pStart = new Vector2(segments[0].x, segments[0].y);
  const pMid   = new Vector2(segments[1].x, segments[1].y)
  const pEnd   = new Vector2(segments[2].x, segments[2].y)

  // Fallback to linear in degenerate cases
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L318-L322
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L366
  const is_linear = Math.abs(((pMid.y - pStart.y) * (pEnd.x - pStart.x)) - ((pMid.x - pStart.x) * (pEnd.y - pStart.y))) < precisionThresholdPx;
  if(is_linear) {
    return linearPath(segments, cs, percent);
  }

  // Mid points
  const midA = pStart.add(pMid).divide(2);
  const midB = pEnd.add(pMid).divide(2);

  // Normal vectors to lines from mid points to pMid
  const normA = rot90(pMid.subtract(pStart));
  const normB = rot90(pMid.subtract(pEnd));

  // Calc intersection point of normal vectors. That is the circle's center.
  const intSlope = intersect_slope(midA, normA, midB, normB, arcParallelThreshold);
  if(intSlope === null) {
    return linearPath(segments, cs, percent);
  }

  // Circle center and radius
  const center = midB.add(normB.scale(intSlope));
  const radius = center.distance(pMid);

  // Calc circle outline 
  const angleStart = Math.atan2(pStart.y - center.y, pStart.x - center.x);
  const angleMid   = Math.atan2(pMid.y - center.y, pMid.x - center.x);
  const angleEnd   = Math.atan2(pEnd.y - center.y, pEnd.x - center.x);  

  const angle0 = Math.min(angleStart, angleMid, angleEnd);
  const angle1 = Math.max(angleStart, angleMid, angleEnd);

  // Calc point on circle outline
  const anglePercent = angle0 + (angle1 - angle0)*percent;

  const posC = {
    x: center.x + radius * Math.cos(anglePercent),
    y: center.y + radius * Math.sin(anglePercent),
  } as Point;

  const posL = {
    x: 0,
    y: 0
  } as Point;

  const posR = {
    x: 0,
    y: 0
  } as Point;
  
  return [posL, posC, posR];
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
