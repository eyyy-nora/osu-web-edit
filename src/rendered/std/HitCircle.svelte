<script lang="ts" context="module">
import { GameObject, Graphics, TextField } from "black-engine";
import { BeatmapCircle } from "src/io";
import { approachCircleColor, approachCircleWidthFactor, borderColor, borderWidthFactor, radiusForCs } from "./general";
import { BeatmapObjectWithStdProps } from "./types";

export class BeatmapCircleObject extends GameObject {
  circleObj: BeatmapCircle & BeatmapObjectWithStdProps;
  g: Graphics;
  t: TextField;
  zIndex: number;

  constructor(circle: BeatmapCircle & BeatmapObjectWithStdProps) {
    super();
    this.circleObj = circle;
    this.zIndex = circle.zIndex;
  }

  public onAdded() {
    this.g = new Graphics();
    this.t = new TextField("1", "Arial", borderColor);
    this.addChild(this.g);
    this.addChild(this.t);
  }

  protected onUpdate() {
    const { circleObj: c, g, t } = this;
    const { x = 0, y = 0, cs = 4, combo = 1, color = 0, alpha = 0, approach = 0, zIndex } = c;
    this.zIndex = zIndex;
    const r = radiusForCs(cs);

    g.clear();
    t.x = g.x = x;
    t.y = g.y = y;
    g.alignPivotOffset();
    t.alignPivotOffset(undefined, .43);

    t.text = `${combo}`;
    t.alpha = alpha;
    t.size = r * 5;
    t.scale = .2;

    // hit circle body
    g.lineStyle(r * borderWidthFactor, borderColor, alpha);
    g.fillStyle(color, alpha);
    g.beginPath();
    g.circle(0, 0, r - r * borderWidthFactor / 2);
    g.fill();
    g.stroke();

    // approach circle
    if (approach) {
      g.lineStyle(r * approachCircleWidthFactor, approachCircleColor, alpha);
      g.fillStyle();
      g.beginPath();
      g.circle(0, 0, r + ((1 - approach) * r * 2));
      g.stroke();
    }


  }
}
</script>

<script lang="ts">
import { addBlackChild } from "src/context";

export let circle: BeatmapCircle & BeatmapObjectWithStdProps = {};
export const gameObj = new BeatmapCircleObject(circle as any);

$: gameObj.circleObj = circle as any;

addBlackChild(gameObj as any);
</script>
