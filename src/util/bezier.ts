import { ParsedSlider, ParsedPoint } from "../parse/types";
import { lerp, intersect_slope, rot90 } from "./numbers";


const linearSubdivision = 5;

// The amount of pieces to calculate for each control point quadruplet.
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


export function sliderPathAt(slider: ParsedSlider, cs: number, percent: number): [ParsedPoint, ParsedPoint, ParsedPoint] {
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
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
  ];
}

function linearPath(segments: ParsedPoint[], cs: number, percent: number): [ParsedPoint, ParsedPoint, ParsedPoint] {
  if(segments.length != 2) {
    // ???
  }

  const p1 = segments[0];
  const p2 = segments[1];

  const posC = {
    x: lerp(p1.x, p2.x, percent),
    y: lerp(p1.y, p2.y, percent)
  } as ParsedPoint;

  const posL = {
    x: 0,
    y: 0
  } as ParsedPoint;

  const posR = {
    x: 0,
    y: 0
  } as ParsedPoint;

  return [posL, posC, posR];  
}

/* Demonstration of the algorithm: https://www.desmos.com/calculator/se3jth7qy9 */
function circlePath(segments: ParsedPoint[], cs: number, percent: number): [ParsedPoint, ParsedPoint, ParsedPoint] {
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L316
  if(segments.length != 3) {
    return bezierPath(segments, cs, percent);
  }

  const pStart = segments[0];
  const pMid   = segments[1];
  const pEnd   = segments[2];

  // Fallback to linear in degenerate cases
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L318-L322
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L366
  const is_linear = Math.abs(((pMid.y - pStart.y) * (pEnd.x - pStart.x)) - ((pMid.x - pStart.x) * (pEnd.y - pStart.y))) < precisionThresholdPx;
  if(is_linear) {
    return linearPath(segments, cs, percent);
  }

  // Mid points
  const midA = {
    x: (pStart.x + pMid.x) / 2,
    y: (pStart.x + pMid.x) / 2
  } as ParsedPoint;
  const midB = {
    x: (pEnd.x + pMid.x) / 2,
    y: (pEnd.x + pMid.x) / 2
  } as ParsedPoint;

  // Normal vectors to lines from mid points to pMid
  const normA = rot90({
    x: pMid.x - pStart.x,
    y: pMid.y - pStart.y
  } as ParsedPoint);
  const normB = rot90({
    x: pMid.x - pEnd.x,
    y: pMid.y - pEnd.y
  } as ParsedPoint);

  // Calc intersection point of normal vectors. That is the circle's center.
  const intSlope = intersect_slope(midA, normA, midB, normB, arcParallelThreshold);
  if(intSlope === null) {
    return linearPath(segments, cs, percent);
  }

  // Circle center and radius
  const center = {
    x : midB.x + normB.x*intSlope,
    y : midB.y + normB.y*intSlope
  } as ParsedPoint;
  
  const radius = Math.sqrt((center.x - pMid.x)**2 + (center.y - pMid.y)**2);

  // Calc circle outline 
  const angleStart = Math.atan2(pStart.y - center.y, pStart.x - center.x);
  const angleMid   = Math.atan2(pMid.y - center.y, pMid.x - center.x);
  const angleEnd   = Math.atan2(pEnd.y - center.y, pEnd.x - center.x);  

  const angle0 = Math.min(angleStart, angleMid, angleEnd);
  const angle1 = Math.max(angleStart, angleMid, angleEnd);

  // Calc point on circle outline
  // TODO: Cache this result
  const anglePercent = angle0 + (angle1 - angle0)*percent;

  const posC = {
    x: center.x + radius * Math.cos(anglePercent),
    y: center.y + radius * Math.sin(anglePercent),
  } as ParsedPoint;

  const posL = {
    x: 0,
    y: 0
  } as ParsedPoint;

  const posR = {
    x: 0,
    y: 0
  } as ParsedPoint;
  
  return [posL, posC, posR];
}

function bezierPath(segments: ParsedPoint[], cs: number, percent: number): [ParsedPoint, ParsedPoint, ParsedPoint] {


  return [
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
  ];
}

function catmullPath(segments: ParsedPoint[], cs: number, percent: number): [ParsedPoint, ParsedPoint, ParsedPoint] {
  // https://github.com/ppy/osu-framework/blob/050a0b8639c9bd723100288a53923547ce87d487/osu.Framework/Utils/PathApproximator.cs#L142
  const subdiv = Array.from(Array(catmullSubdivision).keys());
  const pieces = Array.from(Array(segments.length).keys());

  let v1 = (i: number) => (i > 0)? segments[i - 1] : segments[i];

  // v2 = segments[i]

  let v3 = (i: number) => (i < (segments.length - 1))? segments[i + 1] : {
    x: 2*segments[i].x - v1(i).x,
    y: 2*segments[i].y - v1(i).y,
  } as ParsedPoint;

  let v4 = (i: number) => (i < (segments.length - 2))? segments[i + 2] : {
    x: 2*segments[i].x - v1(i).x,
    y: 2*segments[i].y - v1(i).y,
  } as ParsedPoint;

  const points = pieces.map((i) =>
    subdiv.map((c) => 
      catmullFindPoint(v1(i), segments[i], v3(i), v4(i), c / catmullSubdivision)
    )
  );

  // TODO cache points

  return [
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
  ];
}

function catmullFindPoint(p1: ParsedPoint, p2: ParsedPoint, p3: ParsedPoint, p4: ParsedPoint, t: number): ParsedPoint {
  // https://github.com/ppy/osu-framework/blob/050a0b8639c9bd723100288a53923547ce87d487/osu.Framework/Utils/PathApproximator.cs#L449
  let t2 = t * t;
  let t3 = t2 * t;

  return {
    x: 0.5 * (2 * p2.x + (-p1.x + p3.x) * t + (2 * p1.x - 5 * p2.x + 4 * p3.x - p4.x) * t2 + (-p1.x + 3 * p2.x - 3 * p3.x + p4.x) * t3),
    y: 0.5 * (2 * p2.y + (-p1.y + p3.y) * t + (2 * p1.y - 5 * p2.y + 4 * p3.y - p4.y) * t2 + (-p1.y + 3 * p2.y - 3 * p3.y + p4.y) * t3),
  } as ParsedPoint;
}
