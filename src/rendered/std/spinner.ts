import { Graphics } from "pixi.js";
import { registerPixi } from "../../context/pixi-context";
import { onDestroy } from "svelte";
import { osuRankableArea } from "../../constants";
import {
  approachCircleColor,
  borderColor,
  spinnerInnerRadius,
  spinnerOuterRadius
} from "./general";

const x = osuRankableArea.width / 2;
const y = osuRankableArea.height / 2;
const outerRadius = osuRankableArea.height / 1.8;
const innerRadius = osuRankableArea.height / 25;
const minProgress = 0.10329445234708401;

export function initSpinnerBody(alpha: number, zIndex: number) {
  const g = new Graphics();
  g.position.set(x, y);
  updateSpinnerBody(g, alpha, zIndex);

  g.lineStyle({ color: borderColor, width: spinnerOuterRadius, alignment: 0 });
  g.drawCircle(0, 0, outerRadius);

  g.lineStyle({ color: borderColor, width: spinnerInnerRadius, alignment: 1 });
  g.drawCircle(0, 0, innerRadius);

  return [g, updateSpinnerBody.bind(null, g)];
}

export function updateSpinnerBody(g: Graphics, alpha: number, zIndex: number) {
  g.alpha = alpha;
  g.zIndex = zIndex;
}

export function initSpinnerProgress(progress: number, alpha: number, zIndex: number) {
  const g = new Graphics();
  g.position.set(x, y);
  updateSpinnerProgress(g, progress, alpha, zIndex);
  g.lineStyle({ color: approachCircleColor, width: spinnerInnerRadius, alignment: 0 });
  g.drawCircle(0, 0, outerRadius);
  return [g, updateSpinnerProgress.bind(null, g)];
}

export function updateSpinnerProgress(g: Graphics, progress: number, alpha: number, zIndex: number) {
  if (progress <= 0 || progress >= 1) {
    g.alpha = 0;
  } else {
    g.alpha = alpha;
    g.zIndex = zIndex;
    g.scale.set(1 - (progress * (1 - minProgress)));
  }
}

export function useSpinner(progress: number, alpha: number, zIndex: number) {
  const [body, updateBody] = initSpinnerBody(alpha, zIndex);
  const [prog, updateProg] = initSpinnerProgress(progress, alpha, zIndex);

  function update(progress: number, alpha: number, zIndex: number) {
    updateBody(alpha, zIndex);
    updateProg(progress, alpha, zIndex);
  }

  onDestroy(registerPixi(body, prog));

  return update;
}
