import { Bezier } from "bezier-js";
import { Graphics, LINE_CAP, LINE_JOIN } from "pixi.js";
import { onDestroy } from "svelte";
import { registerPixi } from "../../context/pixi-context";
import { ParsedPoint, ParsedSlider } from "../../parse/types";
import {
  borderWidthFactor,
  radiusForCs,
  sliderBodyColor,
  sliderBorderColor
} from "./general";
import {
  initApproachCircle,
  initComboText,
  initHitCircleBody
} from "./hit-circle";



interface SliderPoint { x: number; y: number; }

function drawSliderPoints(g: Graphics, points: SliderPoint[]) {
  for (const { x, y } of points) g.lineTo(x, y);
}

function centerOf(p1: SliderPoint, p2: SliderPoint): SliderPoint {
  return {
    x: Math.min(p1.x, p2.x) + Math.abs(p1.x - p2.x) / 2,
    y: Math.min(p1.y, p2.y) + Math.abs(p1.y - p2.y) / 2,
  };
}

function difference(p1: SliderPoint, p2: SliderPoint): SliderPoint {
  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
}

function rotate90(p: SliderPoint): SliderPoint {
  // noinspection JSSuspiciousNameCombination
  return { x: p.y, y: -p.x, };
}

function angle({ x, y }: SliderPoint): number {
  return Math.atan2(x, y);
}

function distance(p1: SliderPoint, p2: SliderPoint): number {
  return Math.sqrt(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2));
}

function add(p1: SliderPoint, p2: SliderPoint): SliderPoint {
  return {
    x: p1.x + p2.x,
    y: p1.x + p2.x,
  };
}

function lineIntersection(p1: SliderPoint, p2: SliderPoint, p3: SliderPoint, p4: SliderPoint): SliderPoint {
  const c2x = p3.x - p4.x; // (x3 - x4)
  const c3x = p1.x - p2.x; // (x1 - x2)
  const c2y = p3.y - p4.y; // (y3 - y4)
  const c3y = p1.y - p2.y; // (y1 - y2)

  // down part of intersection point formula
  const d  = c3x * c2y - c3y * c2x;

  // upper part of intersection point formula
  const u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
  const u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)

  // intersection point formula
  const x = (u1 * c2x - c3x * u4) / d;
  const y = (u1 * c2y - c3y * u4) / d;

  return { x, y };
}

function circleCenterOf(p1: SliderPoint, p2: SliderPoint, p3: SliderPoint): SliderPoint {
  const center1 = centerOf(p1, p2);
  const center2 = centerOf(p2, p3);

  const end1 = add(center1, rotate90(difference(p1, p2)));
  const end2 = add(center2, rotate90(difference(p2, p3)));

  return lineIntersection(center1, end1, center2, end2);
}

function drawCircleSlider(g: Graphics, points: SliderPoint[]) {
  const [start, middle, end] = points;

  const center = circleCenterOf(start, middle, end);
  const radius = distance(center, start);

  g.arcTo(middle.x, middle.y, end.x, end.y, radius);
}

function separateAtAnchors(points: ParsedPoint[]): ParsedPoint[][] {
  if (!points.length) return [];
  let current: ParsedPoint[] = [];
  const results: ParsedPoint[][] = [];
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

function drawBezierSlider(g: Graphics, points: ParsedPoint[]) {
  const bezierSections = separateAtAnchors(points);
  for (const section of bezierSections) {
    const bezier = new Bezier(section);
    const lut = bezier.getLUT(Math.max(2, Math.min(30, bezier.length() / 10)));
    drawSliderPoints(g, lut);
  }
}

function drawCatmullSlider(g: Graphics, points: ParsedPoint[]) {
  // todo: render catmull sliders
  console.warn("Catmull sliders not supported yet!");
}

const sliderTypeRenderer: Record<ParsedSlider["sliderType"], (g: Graphics, points: ParsedPoint[]) => void> = {
  "linear": drawSliderPoints,
  "circle": drawCircleSlider,
  "bezier": drawBezierSlider,
  "catmull": drawCatmullSlider,
};

function offsetSliderPoints(offsetX: number, offsetY: number, points: ParsedPoint[]): ParsedPoint[] {
  points = points.map(({ x, y, anchor }) => {
    return { anchor, x: x - offsetX, y: y - offsetY };
  });
  points.unshift({ x: 0, y: 0, anchor: false });
  return points;
}

function areTheSamePoints(oldPoints: ParsedPoint[], newPoints: ParsedPoint[]): boolean {
  return oldPoints.length === newPoints.length && !oldPoints.find((oldPoint, index) => {
    const { x, y, anchor } = newPoints[index];
    return oldPoint.x !== x || oldPoint.y !== y || oldPoint.anchor !== anchor;
  });
}


export function initSliderBody(x: number, y: number, type: ParsedSlider["sliderType"], points: ParsedPoint[], r: number) {
  console.log("init", x, y);
  const g = new Graphics();
  g.position.set(x, y);
  const render = sliderTypeRenderer[type];

  g.lineStyle({
    width: r * 2,
    color: sliderBorderColor,
    cap: LINE_CAP.ROUND,
    join: LINE_JOIN.ROUND,
  });
  g.moveTo(0, 0);
  render(g, points);

  g.lineStyle({
    width: (r - (r * borderWidthFactor)) * 2,
    color: sliderBodyColor,
    cap: LINE_CAP.ROUND,
    join: LINE_JOIN.ROUND,
  });
  g.moveTo(0, 0);
  render(g, points);

  return [g, updateSliderBody.bind(null, g)];
}

export function updateSliderBody(g: Graphics, alpha: number, zIndex: number) {
  g.alpha = alpha;
  g.zIndex = zIndex;
}



export interface SliderInitProps {
  alpha: number;
  approach: number;
  progress: number;
  zIndex: number;
  color: number;
  combo: number;
  cs: number;
}

export function useSlider(slider: ParsedSlider, { alpha, approach, progress, zIndex, color, combo, cs }: SliderInitProps) {
  let { x, y, sliderType } = slider, r = radiusForCs(cs), points = slider.pathSegments;

  let [body, updateBody] = initHitCircleBody(x, y, r, color, alpha, zIndex);
  let [text, updateText] = initComboText(x, y, r, alpha, combo, zIndex + .1);
  let [aCircle, updateACircle] = initApproachCircle(x, y, r, alpha, approach, zIndex + .2);
  let [shape, updateShape] = initSliderBody(x, y, sliderType, offsetSliderPoints(x, y, points), r);

  function update(newAlpha: number, newZIndex: number, newApproach: number, newProgess: number) {
    alpha = newAlpha; zIndex = newZIndex; approach = newApproach; progress = newProgess;

    updateBody(alpha, zIndex);
    updateText(alpha, zIndex + .1);
    updateACircle(alpha, zIndex + .2, approach);
    updateShape(alpha, zIndex - .1);
    // updateBall(alpha, zIndex + .3, progress);
  }

  function move(newX: number, newY: number, force = false) {
    if (newX === x && newY === y || force) return;
    x = newX; y = newY;

    body.position.set(x, y);
    text.position.set(x, y);
    aCircle.position.set(x, y);
    shape.position.set(x, y);
  }

  move(x, y, true);

  function updatePath(newX: number, newY: number, type: ParsedSlider["sliderType"], newPoints: ParsedPoint[], newCs: number) {
    if (x === newX && y === newY && sliderType === type && areTheSamePoints(points, newPoints) && cs === newCs) return;
    console.log("path", x === newX, y === newY,  sliderType === type, areTheSamePoints(points, newPoints), cs === newCs);
    x = newX; y = newY; sliderType = type; points = newPoints; cs = newCs; r = radiusForCs(cs);


    unregister();

    [body, updateBody] = initHitCircleBody(x, y, r, color, alpha, zIndex);
    [text, updateText] = initComboText(x, y, r, alpha, combo, zIndex + .1);
    [aCircle, updateACircle] = initApproachCircle(x, y, r, alpha, approach, zIndex + .2);
    [shape, updateShape] = initSliderBody(x, y, type, offsetSliderPoints(x, y, points), r);

    unregister = registerPixi(body, text, aCircle, shape);
  }

  function refresh(newCombo: number, newColor: number, newCs: number) {
    if (newCombo === combo && cs === newCs && newColor === color) return;
    cs = newCs; r = radiusForCs(cs); color = newColor; combo = newCombo;

    console.log("refresh");

    unregister();

    [body, updateBody] = initHitCircleBody(x, y, r, color, alpha, zIndex);
    [text, updateText] = initComboText(x, y, r, alpha, newCombo, zIndex + .1);
    [aCircle, updateACircle] = initApproachCircle(x, y, r, alpha, approach, zIndex + .2);
    [shape, updateShape] = initSliderBody(x, y, sliderType, offsetSliderPoints(x, y, points), r);

    unregister = registerPixi(body, text, aCircle, shape);
  }

  let unregister = registerPixi(body, text, aCircle, shape);

  onDestroy(() => unregister());

  return { update, move, refresh, updatePath };
}
