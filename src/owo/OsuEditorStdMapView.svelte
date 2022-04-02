<script lang="ts">
import type { IApplicationOptions } from "pixi.js";
import { Application, Container } from "pixi.js";
import { osuVisibleArea, osuRankableArea } from "../constants";
import { ParsedHitObject } from "../parse/types";
import { providePixi } from "../context/pixi-context";


export let time: number = 0;
export let objects: ParsedHitObject[] = [];

export let settings: IApplicationOptions = {
  antialias: true,
  backgroundAlpha: 0,
  ...osuVisibleArea,
};
export let app: Application;
export let stage: Container = new Container();

$: app = new Application(settings);

function initApp(settings: IApplicationOptions) {
  app = new Application(settings);
  app.stage.addChild(stage);
}

let container: HTMLDivElement | undefined = undefined;
$: if (container) {
  const child = [...container!.children].filter(child => (child as HTMLElement).tagName === "CANVAS")?.[0];
  if (child !== app.view) {
    if (child) container!.removeChild(child);
    container!.appendChild(app.view);
  }
}

let clientHeight = 0, clientWidth = 0, zoom = 1;
$: if (clientHeight !== 0 && clientWidth !== 0) {
  const zoom = Math.min(clientHeight / osuVisibleArea.height, clientWidth / osuVisibleArea.width);
  // center
  const offsetX = clientWidth / 2 - (osuRankableArea.width) / 2 * zoom;
  // top with minimum distance
  const offsetY = (osuVisibleArea.height - osuRankableArea.height) / 2 * zoom;

  app.stage.setTransform(
    offsetX,
    offsetY,
    zoom,
    zoom,
  )
  app.resizeTo = container;
  app.resize();
}

providePixi(() => app, () => app.stage);
</script>

<div bind:this={container} bind:clientHeight bind:clientWidth>
  <slot/>
</div>

<style>
div {
  margin: 0 1px -3px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
