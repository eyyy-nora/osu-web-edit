<script lang="ts">
import type { IApplicationOptions } from "pixi.js";
import { Application, Container } from "pixi.js";
import { providePixi, StageTransform } from "../../context/pixi-context";



export let settings: IApplicationOptions = {};
export let transform: StageTransform = {};
export let app: Application;
export let stage: Container = new Container();

$: app = new Application(settings);
$: app.stage.setTransform(
  transform.x, transform.y,
  transform.scaleX, transform.scaleY,
  transform.rotation,
  transform.skewX, transform.skewY,
  transform.pivotX, transform.pivotY,
);

function initApp(settings: IApplicationOptions) {
  app = new Application(settings);
}

let container: HTMLDivElement | undefined = undefined;
$: if (container) {
  const child = [...container!.children].filter(child => (child as HTMLElement).tagName === "CANVAS")?.[0];
  if (child !== app.view) {
    if (child) container!.removeChild(child);
    container!.appendChild(app.view);
  }
}

let clientHeight = 0, clientWidth = 0;
$: if (clientHeight !== 0 && clientWidth !== 0) {
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
