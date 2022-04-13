<script lang="ts">
import { SliderInitProps, useSlider } from "./slider";
import { ParsedSlider } from "../../parse/types";

export let slider: ParsedSlider;
export let init: SliderInitProps;

const { update, move, refresh, updatePath } = useSlider(slider, init);

$: update(init.alpha, init.zIndex, init.approach);
$: move(slider.x, slider.y);
$: refresh(init.combo, init.color, init.cs);
$: updatePath(slider.x, slider.y, slider.sliderType, slider.pathSegments, init.cs);

/*
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
}*/


/*function draw(
  x: number, y: number, r: number,
  slider: ParsedSlider,
  color: number, alpha: number, combo: number,
  hit: boolean, approach: number
) {
  g.clear();

  // Slider Path
  /!*const path = sliderPath(slider);
  if (path && path.length) {
    const { x: oldX, y: oldY } = g.position;
    g.moveTo(x, y);
    g.beginFill(0x222222, alpha * .6);
    g.lineStyle({ alpha, color: 0x555555, width: r / 14, alignment: 0 });
    // todo: slider path

    const lhs: Bezier[] = [], rhs: Bezier[] = [], lengths: number[] = [];

    for (const segment of path) {
      lengths.push(segment.length());
      const [,right,,left] = segment.outline(r).curves;
      lhs.push(left);
      rhs.push(right);
    }

    drawSliderEndCap(g, x, y, path[0].normal(0), r, true);

    for (let i = 0; i < lengths.length; ++i)
      drawPathAlong(g, lhs[i].getLUT(Math.max(2, Math.floor(lengths[i] / r * 3))));

    drawSliderEndCap(g, x, y, path[path.length - 1].normal(1), r);

    // for (let i = lengths.length - 1; i >= 0; --i)
      // drawPathAlong(g, rhs[i].getLUT(Math.max(2, Math.floor(lengths[i] / r * 3))));

    g.endFill();
    g.position.set(oldX, oldY);
  }*!/

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
}*/
</script>
