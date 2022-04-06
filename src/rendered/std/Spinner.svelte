<script lang="ts">
import { Graphics } from "pixi.js";
import { osuRankableArea } from "../../constants";
import { onDestroy } from "svelte";
import { registerPixi } from "../../context/pixi-context";

const x: number = osuRankableArea.width / 2;
const y: number = osuRankableArea.height / 2;
const centerRadius: number = 10;
const outerRadius: number = osuRankableArea.height / 1.8;
export let hit: boolean = false;
export let alpha: number = 1;
export let percent: number = 1;

let g: Graphics;

let unregister: undefined | (() => void);
function draw(alpha: number, hit: boolean, percent: number) {
  if (unregister) unregister();

  const color = 0xffffff;

  g = new Graphics();
  // inner
  g.lineStyle({ alpha, color, width: 5, alignment: 0 });
  g.drawCircle(x, y, centerRadius);

  // outer
  g.lineStyle({ alpha, color, width: 3, alignment: 1 });
  g.drawCircle(x, y, outerRadius);

  if (percent) {
    g.lineStyle({ alpha, color: 0x888888, width: 3, alignment: 1 });
    g.drawCircle(x, y, centerRadius + (outerRadius - centerRadius) * (1 - percent));
  }
  unregister = registerPixi(g);
}

$: draw(alpha, hit, percent);

onDestroy(() => unregister?.());
</script>
