<script lang="ts">
import { Graphics, Text } from "pixi.js";
import { ParsedBezierSlider, ParsedLinearSlider, ParsedPerfectCircleSlider, ParsedSlider } from "../../parse/types";
import { colorToNumber, darken } from "../../util/color";
import { onDestroy } from "svelte";
import { registerPixi } from "../../context/pixi-context";
import { Bezier } from "bezier-js";

export let x: number = 0;
export let y: number = 0;
export let color: [number, number, number] = [64, 0, 0];
export let combo: number = 1;
export let hit: boolean = false;
export let cs: number = 4.2;
export let alpha: number = 1;
export let approach: number = 1;
export let slider: ParsedSlider;

function bezierSliderPath(slider: ParsedBezierSlider) {
  const bezierCurves: Bezier[] = [];
  let points: number[] = [slider.x, slider.y];

  for (const segment of slider.pathSegments) {
    points.push(segment.x, segment.y);
    if (segment.anchor) {
      // bezier curve
      if (points.length > 4) bezierCurves.push(new Bezier(...points));
      // straight line
      else bezierCurves.push(new Bezier(
        points[0], points[1],
        (points[0] + points[2]) / 2, (points[1] + points[3]) / 2,
        points[2], points[3])
      );
      points = [segment.x, segment.y];
    }
  }

  return bezierCurves;
}

function linearSliderPath(slider: ParsedLinearSlider) {
  const segments: Bezier[] = [];
  let prev: { x: number, y: number } = slider;
  for (const segment of slider.pathSegments) {
    segments.push(new Bezier(
      prev.x, prev.y,
      (segment.x + prev.x) / 2, (segment.y + prev.y) / 2,
      segment.x, segment.y
    ));
    prev = segment;
  }
  return segments;
}

function perfectCircleSliderPath(slider: ParsedPerfectCircleSlider) {

}

function sliderPath(slider: ParsedSlider) {
  switch (slider.sliderType) {
    case "bezier": return bezierSliderPath(slider);
    case "linear": return linearSliderPath(slider);
    default: return;
  }
}

let g: Graphics, t: Text;

let unregister: undefined | (() => void);
function draw(
  x: number, y: number, r: number,
  slider: ParsedSlider,
  color: number, alpha: number, combo: number,
  hit: boolean, approach: number
) {
  if (unregister) unregister();
  g = new Graphics();

  // Slider Path
  const path = sliderPath(slider);
  if (path) {
    const { x: oldX, y: oldY } = g.position;
    g.position.set(x, y);
    g.beginFill(0x333333, alpha);
    g.lineStyle({ alpha, color: 0x888888, width: r / 14, alignment: 0 });
    // todo: slider path
    for (const segment of path) {
      for (const curve of segment.outline(r).curves) {
        for (const {x, y} of (curve as Bezier).getLUT(100)) {
          g.lineTo(x, y);
        }
      }
    }
    g.position.set(oldX, oldY);
  }

  // HitCircle
  g.beginFill(color, alpha);
  g.lineStyle({ alpha, color: hit ? 0xaaaaaa : 0xffffff, width: r / 14, alignment: 0 });
  g.drawCircle(x, y, r);
  g.endFill();

  // Approach Circle
  if (approach) {
    g.lineStyle({ alpha, color: 0x888888, width: r / 20, alignment: 1 });
    g.drawCircle(x, y, r + r * 2 * (1 - approach));
  }

  // Combo
  t = new Text(`${combo}`, { fontSize: r * 2, fill: hit ? "#aaaaaa" : "#ffffff", fontWeight: "500" });
  t.anchor.set(.5);
  t.position.set(x, y);
  t.alpha = alpha;
  t.scale.set(.5);

  unregister = registerPixi(g, t);
}

$: draw(
  x, y,
  54.4 - 4.48 * cs,
  slider,
  colorToNumber(hit ? darken(color, .2) : color),
  alpha,
  combo,
  hit,
  approach
);

onDestroy(() => unregister?.());
</script>
