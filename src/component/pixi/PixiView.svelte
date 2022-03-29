<script lang="ts">
import type { IApplicationOptions } from "pixi.js";
import { Application } from "pixi.js";

export let settings: IApplicationOptions = {};
export let app: Application;

$: app = new Application(settings);

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

</script>

<div bind:this={container} bind:clientHeight bind:clientWidth />

<style>
div {
  margin: 0 1px -3px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
