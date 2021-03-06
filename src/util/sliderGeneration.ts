import { BeatmapSlider, BeatmapSliderPoint } from "src/io";
import { range, mapIterator, lerp, intersect_slope, rot90, bernstein } from "./numbers";
import { vecAddVec, vecSubVec, vecDivVal, vecMulVal, vec2DLen } from "./vector";


const linearSubdivision = 5;

// The amount of pieces to calculate for each control point quadruplet.
const catmullSubdivision = 50;

const precisionThresholdPx = 0.01;

const approxLevel = 4

const arcParallelThreshold = 0.00001;

const curvePointsSeparation = 5;

/* Ticks closer to the end time of the slider than this are not generated.
 * Value: https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/SliderEventGenerator.cs#L24 */
const tickCutoffMs = 10;

/* The tick for sliderend judgement is offset backwards in time by this amount
 * unless the slider is particularly short.
 *
 * Value: https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertSlider.cs#L52
 * Usage: https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/SliderEventGenerator.cs#L79 */
const endTickOffsetMs = 36;


export function sliderPathAt(slider: BeatmapSlider, cs: number, percent: number): (percent: number) => BeatmapSliderPoint {
  let path: (percent: number) => BeatmapSliderPoint;

  if(slider.sliderType === "linear") {
    path = linearPath(slider.path);
  } else if(slider.sliderType === "circle") {
    path = circlePath(slider.path);
  } else if(slider.sliderType === "bezier") {
    path = bezierPath(slider.path);
  } else if(slider.sliderType === "catmull") {
    path = catmullPath(slider.path);
  } else {
    // error?
  }

  return path;
}

function linearPath(segments: BeatmapSliderPoint[]): (percent: number) => BeatmapSliderPoint {
  if(segments.length != 2) {
    // ???
  }

  return (percent: number) => ({
    x: lerp(segments[0].x, segments[1].x, Math.max(0, Math.min(1, percent))),
    y: lerp(segments[0].y, segments[1].y, Math.max(0, Math.min(1, percent)))
  } as BeatmapSliderPoint);
}

/* Demonstration of the algorithm: https://www.desmos.com/calculator/se3jth7qy9 */
function circlePath(points: BeatmapSliderPoint[]): (percent: number) => BeatmapSliderPoint {
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L316
  if(points.length != 3) {
    return bezierPath(points);
  }

  const pStart = [ points[0].x, points[0].y ];
  const pMid   = [ points[1].x, points[1].y ];
  const pEnd   = [ points[2].x, points[2].y ];

  // Fallback to linear in degenerate cases
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L318-L322
  // https://github.com/ppy/osu/blob/ed992eed64b30209381f040586b0e8392d1c168e/osu.Game/Rulesets/Objects/Legacy/ConvertHitObjectParser.cs#L366
  const is_linear = Math.abs(((pMid[1] - pStart[1]) * (pEnd[0] - pStart[0])) - ((pMid[0] - pStart[0]) * (pEnd[1] - pStart[1]))) < precisionThresholdPx;
  if(is_linear) {
    return linearPath(points);
  }

  // Mid points
  const midA = vecDivVal(vecAddVec(pStart, pMid), 2);
  const midB = vecDivVal(vecAddVec(pEnd, pMid), 2);

  // Normal vectors to lines from mid points to pMid
  const normA = rot90(vecSubVec(pMid, pStart));
  const normB = rot90(vecSubVec(pMid, pEnd));

  // Calc intersection point of normal vectors. That is the circle's center.
  const intSlope = intersect_slope(midA, normA, midB, normB, arcParallelThreshold);
  if(intSlope === null) {
    return linearPath(points);
  }

  // Circle center and radius
  const center = vecAddVec(midB, vecMulVal(normB, intSlope));
  const radius = Math.sqrt((center[0] - pMid[0])**2 + (center[1] - pMid[1])**2);

  // Calc circle outline
  const angleStart = Math.atan2(pStart[1] - center[1], pStart[0] - center[0]);
  const angleMid   = Math.atan2(pMid[1] - center[1], pMid[0] - center[0]);
  const angleEnd   = Math.atan2(pEnd[1] - center[1], pEnd[0] - center[0]);

  const angle0 = Math.min(angleStart, angleMid, angleEnd);
  const angle1 = Math.max(angleStart, angleMid, angleEnd);

  // Calc point on circle outline
  // TODO: Cache this result
  return (percent: number) => {
    let anglePercent = angle0 + (angle1 - angle0)*Math.max(0, Math.min(1, percent));

    return {
      x: center[0] + radius * Math.cos(anglePercent),
      y: center[1] + radius * Math.sin(anglePercent),
    } as BeatmapSliderPoint;
  };
}

function bezierPath(points: BeatmapSliderPoint[]): (percent: number) => BeatmapSliderPoint {
  let genPoints: BeatmapSliderPoint[] = Array.from(createBeziers(points));
  return (percent: number) => genPoints[Math.floor(percent * (genPoints.length - 1))];
}

function catmullPath(points: BeatmapSliderPoint[]): (percent: number) => BeatmapSliderPoint {
  // https://github.com/ppy/osu-framework/blob/050a0b8639c9bd723100288a53923547ce87d487/osu.Framework/Utils/PathApproximator.cs#L142
  // Demo: https://www.desmos.com/calculator/gdo3e6rleh
  const subdiv = range(catmullSubdivision);
  const pieces = range(points.length - 1);

  let v1 = (i: number) => (i > 0)? points[i - 1] : points[i];

  // v2 = points[i]

  let v3 = (i: number) => (i < (points.length - 1))? points[i + 1] : {
    x: 2*points[i].x - v1(i).x,
    y: 2*points[i].y - v1(i).y,
  } as BeatmapSliderPoint;

  let v4 = (i: number) => (i < (points.length - 2))? points[i + 2] : {
    x: 2*v3(i).x - points[i].x,
    y: 2*v3(i).y - points[i].y,
  } as BeatmapSliderPoint;

  const genPoints = Array.from(
    mapIterator(pieces, (i) =>
      mapIterator(subdiv, (c) =>
        catmullFindPoint(v1(i), points[i], v3(i), v4(i), c / catmullSubdivision)
      )
    ));

  return (percent: number) => genPoints[Math.floor(percent * (genPoints.length - 1))];
}

function catmullFindPoint(p1: BeatmapSliderPoint, p2: BeatmapSliderPoint, p3: BeatmapSliderPoint, p4: BeatmapSliderPoint, t: number): BeatmapSliderPoint {
  // https://github.com/ppy/osu-framework/blob/050a0b8639c9bd723100288a53923547ce87d487/osu.Framework/Utils/PathApproximator.cs#L449
  let t2 = t * t;
  let t3 = t2 * t;

  return {
    x: 0.5 * (2*p2.x + (-p1.x + p3.x)*t + (2*p1.x - 5*p2.x + 4*p3.x - p4.x)*t2 + (-p1.x + 3*p2.x - 3*p3.x + p4.x)*t3),
    y: 0.5 * (2*p2.y + (-p1.y + p3.y)*t + (2*p1.y - 5*p2.y + 4*p3.y - p4.y)*t2 + (-p1.y + 3*p2.y - 3*p3.y + p4.y)*t3),
  } as BeatmapSliderPoint;
}

function parsedPointsToX(points: BeatmapSliderPoint[]): number[] {
  return points.map(({ x }) => x);
}

function parsedPointsToY(points: BeatmapSliderPoint[]): number[] {
  return points.map(({ y }) => y);
}

function* createBeziers(points: BeatmapSliderPoint[]): IterableIterator<BeatmapSliderPoint> {
  let segmentStart = 0;

  // Splits points into different Beziers if two control points are same (red points) or it's end of list
  // Example control point list: a b c - c d - d e f g
  let isSegmentBezier = (i) => (
    (i >= (points.length - 1)) ||
    ((points[i].x != points[i + 1].x) || (points[i].y != points[i + 1].y))
  );

  for(let i = 0; i < points.length; i++) {
    if(isSegmentBezier(i)) {
      // segmentEnd = i
      let segmentPoints = points.slice(segmentStart, i);
      segmentStart = i;

      yield* createBezier(parsedPointsToX(segmentPoints), parsedPointsToY(segmentPoints));
    }
  }
}

function* createBezier(vecX: number[], vecY: number[]): Iterable<BeatmapSliderPoint> {
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
    } as BeatmapSliderPoint;
  }
}
