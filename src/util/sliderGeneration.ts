import { ParsedSlider, ParsedPoint } from "../parse/types";
import { range, mapIterator, lerp, intersect_slope, rot90, bernstein } from "./numbers";
import { vecSum, vecAdd, vecSub, vecPowVal, vecDiff, vec2DLen, xyCol } from "./vector";


const linearSubdivision = 5;

// The amount of pieces to calculate for each control point quadruplet.
const catmullSubdivision = 50;

const precisionThresholdPx = 0.01;

const approxLevel = 4

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
  let path: (percent: number) => ParsedPoint;

  if(slider.sliderType === "linear") {
    path = linearPath(slider.pathSegments);
  } else if(slider.sliderType === "circle") {
    path = circlePath(slider.pathSegments);
  } else if(slider.sliderType === "bezier") {
    path = bezierPath(slider.pathSegments);
  } else if(slider.sliderType === "catmull") {
    path = catmullPath(slider.pathSegments);
  } else {
    // error?
  }

  let p1 = path(percent);
  let p2 = (percent == 1)? path(percent - 0.01): path(percent + 0.01);

  let vecXY = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  } as ParsedPoint;

  vecXY = rot90(vecXY);

  return [
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
    {x:0, y:0} as ParsedPoint,
  ];
}

function linearPath(segments: ParsedPoint[]): (percent: number) => ParsedPoint {
  if(segments.length != 2) {
    // ???
  }

  return (percent: number) => ({
    x: lerp(segments[0].x, segments[1].x, Math.max(0, Math.min(1, percent))),
    y: lerp(segments[0].y, segments[1].y, Math.max(0, Math.min(1, percent)))
  } as ParsedPoint);
}

/* Demonstration of the algorithm: https://www.desmos.com/calculator/se3jth7qy9 */
function circlePath(points: ParsedPoint[]): (percent: number) => ParsedPoint {
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L316
  if(points.length != 3) {
    return bezierPath(points);
  }

  const pStart = points[0];
  const pMid   = points[1];
  const pEnd   = points[2];

  // Fallback to linear in degenerate cases
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L318-L322
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L366
  const is_linear = Math.abs(((pMid.y - pStart.y) * (pEnd.x - pStart.x)) - ((pMid.x - pStart.x) * (pEnd.y - pStart.y))) < precisionThresholdPx;
  if(is_linear) {
    return linearPath(points);
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
    return linearPath(points);
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
  return (percent: number) => {
    let anglePercent = angle0 + (angle1 - angle0)*Math.max(0, Math.min(1, percent));

    return {
      x: center.x + radius * Math.cos(anglePercent),
      y: center.y + radius * Math.sin(anglePercent),
    } as ParsedPoint;
  };
}

function bezierPath(points: ParsedPoint[]): (percent: number) => ParsedPoint {
  let genPoints: ParsedPoint[] = Array.from(createBeziers(points));
  return (percent: number) => genPoints[Math.floor(percent * (genPoints.length - 1))];
}

function catmullPath(points: ParsedPoint[]): (percent: number) => ParsedPoint {
  // https://github.com/ppy/osu-framework/blob/050a0b8639c9bd723100288a53923547ce87d487/osu.Framework/Utils/PathApproximator.cs#L142
  // Demo: https://www.desmos.com/calculator/gdo3e6rleh
  const subdiv = range(catmullSubdivision);
  const pieces = range(points.length - 1);

  let v1 = (i: number) => (i > 0)? points[i - 1] : points[i];

  // v2 = points[i]

  let v3 = (i: number) => (i < (points.length - 1))? points[i + 1] : {
    x: 2*points[i].x - v1(i).x,
    y: 2*points[i].y - v1(i).y,
  } as ParsedPoint;

  let v4 = (i: number) => (i < (points.length - 2))? points[i + 2] : {
    x: 2*v3(i).x - points[i].x,
    y: 2*v3(i).y - points[i].y,
  } as ParsedPoint;

  const genPoints = Array.from(
    mapIterator(pieces, (i) =>
      mapIterator(subdiv, (c) => 
        catmullFindPoint(v1(i), points[i], v3(i), v4(i), c / catmullSubdivision)
      )
    ));

  return (percent: number) => genPoints[Math.floor(percent * (genPoints.length - 1))];
}

function catmullFindPoint(p1: ParsedPoint, p2: ParsedPoint, p3: ParsedPoint, p4: ParsedPoint, t: number): ParsedPoint {
  // https://github.com/ppy/osu-framework/blob/050a0b8639c9bd723100288a53923547ce87d487/osu.Framework/Utils/PathApproximator.cs#L449
  let t2 = t * t;
  let t3 = t2 * t;

  return {
    x: 0.5 * (2*p2.x + (-p1.x + p3.x)*t + (2*p1.x - 5*p2.x + 4*p3.x - p4.x)*t2 + (-p1.x + 3*p2.x - 3*p3.x + p4.x)*t3),
    y: 0.5 * (2*p2.y + (-p1.y + p3.y)*t + (2*p1.y - 5*p2.y + 4*p3.y - p4.y)*t2 + (-p1.y + 3*p2.y - 3*p3.y + p4.y)*t3),
  } as ParsedPoint;
}

function parsedPointsToX(points: ParsedPoint[]): number[] {
  return points.map(({ x }) => x);
}

function parsedPointsToY(points: ParsedPoint[]): number[] {
  return points.map(({ y }) => y);
}

function* createBeziers(points: ParsedPoint[]): IterableIterator<ParsedPoint> {
  let segmentStart = 0;
  let segmentEnd = 0;

  // Beziers: splits points into different Beziers if has the same points (red points) or is end of list
  // a b c - c d - d e f g
  let isSegmentBezier = (i) => (
    (i >= (points.length - 1)) ||
    ((points[i].x != points[i + 1].x) || (points[i].y != points[i + 1].y))
  );

  for(let i = 0; i < points.length; i++) {
    if(isSegmentBezier(i)) {
      segmentEnd = i;
      let segmentPoints = points.slice(segmentStart, segmentEnd);
      segmentStart = segmentEnd;

      yield* createBezier(parsedPointsToX(segmentPoints), parsedPointsToY(segmentPoints));
    }
  }
}

function* createBezier(vecX: number[], vecY: number[]): Iterable<ParsedPoint> {
  let approxLen = vec2DLen(vecX, vecY);
  let subdivisions = (Math.min(approxLen / approxLevel)) + 2;

  for(let t = 0; t < subdivisions; t++) {
    let resX = 0;
    let resY = 0;

    for(let i = 0; i < vecX.length; i++) {
      let b = bernstein(i, vecX.length - 1, t/subdivisions);
      resX += b*vecX[i];
      resY += b*vecY[i];
    }

    yield {
      x: resX,
      y: resY,
    } as ParsedPoint;
  }
};
