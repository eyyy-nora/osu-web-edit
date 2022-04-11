import { Graphics, Text } from "pixi.js";
import { onDestroy } from "svelte";
import { registerPixi } from "../../context/pixi-context";
import { colorToNumber } from "../../util/color";
import { ParsedHitCircle } from "../../parse/types";
import {
  approachCircleColor,
  approachCircleWidthFactor,
  borderColor,
  borderWidthFactor, radiusForCs
} from "./general";

export function initHitCircleBody(x: number, y: number, r: number, color: number, alpha: number, zIndex: number) {
  const g = new Graphics();
  g.position.set(x, y);
  updateHitCircleBody(g, alpha, zIndex);
  g.beginFill(color);
  g.lineStyle({ color: borderColor, width: r * borderWidthFactor, alignment: 0 });
  g.drawCircle(0, 0, r);
  g.endFill();
  return [g, updateHitCircleBody.bind(null, g)];
}

export function updateHitCircleBody(g: Graphics, alpha: number, zIndex: number) {
  g.alpha = alpha;
  g.zIndex = zIndex;
}

export function initComboText(x: number, y: number, r: number, alpha: number, combo: number, zIndex: number) {
  const t = new Text(`${combo}`, { fontSize: r * 2, fill: "#ffffff", fontWeight: "500" });
  t.position.set(x, y);
  updateComboText(t, alpha, zIndex);
  t.anchor.set(0.5);
  t.scale.set(.5);
  return [t, updateComboText.bind(null, t)];
}

export function updateComboText(t: Text, alpha: number, zIndex: number) {
  t.alpha = alpha;
  t.zIndex = zIndex;
}

export function initApproachCircle(x: number, y: number, r: number, alpha: number, approach: number, zIndex: number) {
  const g = new Graphics();
  g.position.set(x, y);
  updateApproachCircle(g, alpha, zIndex, approach);
  g.lineStyle({ color: approachCircleColor, width: r * approachCircleWidthFactor, alignment: 1 });
  g.drawCircle(0, 0, r);
  return [g, updateApproachCircle.bind(null, g)];
}

export function updateApproachCircle(g: Graphics, alpha: number, zIndex: number, approach: number) {
  const factor = 2.6;
  if (!approach) g.alpha = 0;
  else {
    g.alpha = alpha;
    g.scale.set((factor + 1) - approach * factor);
  }
  g.zIndex = zIndex;
}

export interface HitCircleInitProps {
  alpha: number;
  approach: number;
  zIndex: number;
  color: [number, number, number];
  combo: number;
  cs: number;
}

export function useHitCircle(circle: ParsedHitCircle, { alpha, approach, zIndex, color, combo, cs }: HitCircleInitProps) {
  let { x, y } = circle, r = radiusForCs(cs), colorNum = colorToNumber(color);

  let [body, updateBody] = initHitCircleBody(x, y, r, colorNum, alpha, zIndex);
  let [text, updateText] = initComboText(x, y, r, alpha, combo, zIndex + .1);
  let [aCircle, updateACircle] = initApproachCircle(x, y, r, alpha, approach, zIndex + .2);

  function update(newAlpha: number, newZIndex: number, newApproach: number) {
    alpha = newAlpha; zIndex = newZIndex; approach = newApproach;

    updateBody(alpha, zIndex);
    updateText(alpha, zIndex + .1);
    updateACircle(alpha, zIndex + .2, approach);
  }

  function move(newX: number, newY: number) {
    if (newX === x && newY === y) return;
    x = newX; y = newY;

    body.position.set(x, y);
    text.position.set(x, y);
    aCircle.position.set(x, y);
  }

  function refresh(newCombo: number, newColor: [number, number, number], newCs: number) {
    const newColorNum = colorToNumber(newColor);
    if (newCombo === combo && cs === newCs && newColorNum === colorNum) return;
    cs = newCs; r = radiusForCs(cs); colorNum = newColorNum; combo = newCombo;

    unregister();

    [body, updateBody] = initHitCircleBody(x, y, r, colorToNumber(color), alpha, zIndex);
    [text, updateText] = initComboText(x, y, r, alpha, newCombo, zIndex + .1);
    [aCircle, updateACircle] = initApproachCircle(x, y, r, alpha, approach, zIndex + .2);

    unregister = registerPixi(body, text, aCircle);
  }

  let unregister = registerPixi(body, text, aCircle);

  onDestroy(() => unregister());

  return { update, move, refresh };
}
