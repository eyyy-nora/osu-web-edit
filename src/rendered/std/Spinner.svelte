<script lang="ts" context="module">
import { GameObject, Graphics } from "black-engine";
import { osuRankableArea } from "src/constants";
import { BeatmapSpinner } from "src/io";
import { approachCircleColor, borderColor, spinnerInnerRadius, spinnerOuterRadius } from "./general";
import { BeatmapObjectWithStdProps } from "./types";

const spinnerX = osuRankableArea.width / 2;
const spinnerY = osuRankableArea.height / 2;
const outerRadius = osuRankableArea.height / 1.8;
const innerRadius = osuRankableArea.height / 25;

export class BeatmapSpinnerObject extends GameObject {
  spinnerObj: BeatmapSpinner & BeatmapObjectWithStdProps;
  g: Graphics;
  zIndex: number;

  constructor(spinner: BeatmapSpinner & BeatmapObjectWithStdProps) {
    super();
    this.spinnerObj = spinner;
    this.zIndex = this.spinnerObj.zIndex;
  }

  public onAdded() {
    this.g = new Graphics();
    this.addChild(this.g);
  }

  protected onUpdate() {
    const { spinnerObj: spinner, g } = this;
    const { percent = 0, alpha = 0 } = spinner;

    g.clear();
    g.x = spinnerX;
    g.y = spinnerY;
    g.alignPivotOffset();

    if (percent > 0 && percent < 1) {
      g.lineStyle(spinnerInnerRadius, approachCircleColor, alpha);
      g.beginPath();
      g.circle(0, 0, innerRadius + (outerRadius - innerRadius) * (1 - percent));
      g.stroke();
    }

    g.lineStyle(spinnerOuterRadius, borderColor, alpha);
    g.beginPath();
    g.circle(0, 0, outerRadius);
    g.stroke();

    g.lineStyle(spinnerInnerRadius, borderColor, alpha);
    g.beginPath();
    g.circle(0, 0, innerRadius);
    g.stroke();
  }
}

</script>

<script lang="ts">
import { addBlackChild } from "src/context";

export let spinner: BeatmapSpinner & BeatmapObjectWithStdProps = {};
export const gameObj = new BeatmapSpinnerObject(spinner as any);

$: gameObj.spinnerObj = spinner as any;

addBlackChild(gameObj as any);
</script>
