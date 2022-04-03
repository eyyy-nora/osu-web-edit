<script lang="ts">
import { Graphics } from "pixi.js";
import { onDestroy } from "svelte";
import { osuRankableArea } from "../../constants";
import { registerPixi } from "../../context/pixi-context";

export let alpha: number = 1;

const g = new Graphics();

const { width, height } = osuRankableArea;

g.lineStyle({ alpha, color: 0xffffff, width: 3, alignment: 1 });
g.drawRect(0, 0, width, height);

onDestroy(registerPixi(g));
</script>
