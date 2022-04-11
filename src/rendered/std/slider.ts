import { registerPixi } from "../../context/pixi-context";
import { ParsedSlider } from "../../parse/types";
import { radiusForCs } from "./general";
import { initComboText, initHitCircleBody, initApproachCircle } from "./hit-circle";
import { onDestroy } from "svelte";



export interface SliderInitProps {
  alpha: number;
  approach: number;
  zIndex: number;
  color: number;
  combo: number;
  cs: number;
}

export function useSlider(circle: ParsedSlider, { alpha, approach, zIndex, color, combo, cs }: SliderInitProps) {
  let { x, y } = circle, r = radiusForCs(cs);

  let [body, updateBody] = initHitCircleBody(x, y, r, color, alpha, zIndex);
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

  function refresh(newCombo: number, newColor: number, newCs: number) {
    if (newCombo === combo && cs === newCs && newColor === color) return;
    cs = newCs; r = radiusForCs(cs); color = newColor; combo = newCombo;

    unregister();

    [body, updateBody] = initHitCircleBody(x, y, r, color, alpha, zIndex);
    [text, updateText] = initComboText(x, y, r, alpha, newCombo, zIndex + .1);
    [aCircle, updateACircle] = initApproachCircle(x, y, r, alpha, approach, zIndex + .2);

    unregister = registerPixi(body, text, aCircle);
  }

  let unregister = registerPixi(body, text, aCircle);

  onDestroy(() => unregister());

  return { update, move, refresh };
}
