<script lang="ts">
import type { ParsedHitObject } from "../parse/types";
import { onMount } from "svelte";
import PixiView from "../component/pixi/PixiView.svelte";
import type { Application, IApplicationOptions } from "pixi.js";

export let time: number = 0;
export let objects: ParsedHitObject[] = [];

let app: Application;

const settings: IApplicationOptions = {
  antialias: true
}

onMount(() => {
  app.ticker.add(() => {
    // todo: update renderer
  });
  console.log(app);
})

</script>

<PixiView settings={settings} bind:app />
