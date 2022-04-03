<script lang="ts">
import { Graphics, Text } from "pixi.js";
import { colorToNumber, darken } from "../../util/color";
import { onDestroy } from "svelte";
import { registerPixi } from "../../context/pixi-context";

export let x: number = 0;
export let y: number = 0;
export let color: [number, number, number] = [64, 0, 0];
export let combo: number = 1;
export let hit: boolean = false;
export let cs: number = 4.2;
export let alpha: number = 1;

let unregister: undefined | (() => void);
function draw(x: number, y: number, r: number, color: number, alpha: number, combo: number, hit: boolean) {
  if (unregister) unregister();

  const g = new Graphics();
  g.beginFill(color, alpha);
  g.lineStyle({
    alpha,
    color: hit ? 0xaaaaaa : 0xffffff,
    width: r / 14,
    alignment: 0,
  });
  g.drawCircle(x, y, r);
  g.endFill();

  const t = new Text(`${combo}`, {
    fontSize: r * 2,
    fill: hit ? "#aaaaaa" : "#ffffff",
    fontWeight: "500",
  });
  t.anchor.set(.5);
  t.position.set(x, y);
  t.alpha = alpha;
  t.scale.set(.5);

  unregister = registerPixi(g, t);
}

$: draw(
  x, y,
  54.4 - 4.48 * cs,
  colorToNumber(hit ? darken(color, .2) : color),
  alpha,
  combo,
  hit,
);

onDestroy(() => unregister?.());
</script>
