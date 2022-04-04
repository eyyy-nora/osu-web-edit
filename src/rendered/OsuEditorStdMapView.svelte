<script lang="ts">
import type { IApplicationOptions } from "pixi.js";
import { Application, Container } from "pixi.js";
import { osuVisibleArea, osuRankableArea } from "../constants";
import { ParsedBeatmap, ParsedHitObject } from "../parse/types";
import { providePixi } from "../context/pixi-context";
import HitCircle from "./std/HitCircle.svelte";


export let time: number = 0;
export let zoom: number = 2;
export let beatmap: ParsedBeatmap | undefined;
export let hitObjects: ParsedHitObject[] = [];
export let settings: IApplicationOptions = {
  antialias: true,
  backgroundAlpha: 0,
  ...osuVisibleArea,
};

export let app: Application;
$: app = new Application(settings);

let approachRate: number, preempt: number, fadein: number, fadeOffset: number, scope: number;
$: approachRate = beatmap?.Difficulty.ApproachRate ?? 8;
$: preempt = 1200 + (approachRate > 5 ? -150 * (approachRate - 5) : 120 * (5 - approachRate));
$: fadein = 800 + (approachRate > 5 ? -100 * (approachRate - 5) : 80 * (5 - approachRate));
$: fadeOffset = preempt - fadein;
$: scope = preempt * zoom;

function objectEnd(object: ParsedHitObject & { length?: number }): number {
  return object.length !== undefined ? object.time + object.length : object.time;
}

function objectInRange(object: ParsedHitObject, start: number, end: number): boolean {
  return objectEnd(object) >= start && object.time <= end;
}

function filterInRange(objects: ParsedHitObject[], start: number, end: number, sections = 10): ParsedHitObject[] {
  const length = objects.length;
  if (length <= sections) return objects.filter(object => objectInRange(object, start, end));
  const step = (length / sections) | 0;
  let current = 0, firstObjectIndex = 0, i = 0, j = 0, m = 0;

  while (length > (m = current * step) && objectEnd(objects[m]) < start) current++;
  if (m >= length) m = length - 1;
  while (m - i >= 0 && objectEnd(objects[m - i]) >= start) firstObjectIndex = m - i++;
  while (firstObjectIndex + j < length && objects[firstObjectIndex + j].time <= end) j++;

  return objects.slice(firstObjectIndex, firstObjectIndex + j);
}

function visibleObjectStats(object: ParsedHitObject) {
  const oTime = object.time - time;
  const hit = oTime <= 0;
  const alpha =
    Math.abs(oTime) > preempt
      // Not in visible scope on beatmap but visible in editor
      ? .3 * Math.min(1, 1 - Math.abs(oTime) / scope)
      // Visible - base plus fading determined
      : .3 + .7 * (oTime < 0
        // After being hit - fade out to base level
        ? 1 - (-oTime / preempt)
        // Before being hit - fade in or stay visible
        : oTime < fadeOffset ? 1 : 1 - (oTime - fadeOffset) / fadein
      );
  const approach = oTime > 0 ? oTime > preempt ? 0 : 1 - (oTime / preempt) : 0;
  return { ...object, hit, alpha, approach };
}

let visibleObjects: (ParsedHitObject & any)[];
$: visibleObjects = filterInRange(hitObjects, time - scope, time + scope).map(visibleObjectStats).reverse();

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
  const viewportZoom = Math.min(clientHeight / osuVisibleArea.height, clientWidth / osuVisibleArea.width);
  // center
  const offsetX = clientWidth / 2 - (osuRankableArea.width) / 2 * viewportZoom;
  // top with minimum distance
  const offsetY = (osuVisibleArea.height - osuRankableArea.height) / 2 * viewportZoom;

  app.stage.setTransform(
    offsetX,
    offsetY,
    viewportZoom,
    viewportZoom,
  )
  app.resizeTo = container;
  app.resize();
}

providePixi(() => app, () => app.stage);
</script>

<div bind:this={container} bind:clientHeight bind:clientWidth>
  {#each visibleObjects as object}
    {#if object.type === "circle"}
      <HitCircle {...object} />
    {/if}
  {/each}

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
