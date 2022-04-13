<script lang="ts">
import type { IApplicationOptions } from "pixi.js";
import { Application, Container } from "pixi.js";
import { osuVisibleArea, osuRankableArea } from "../constants";
import { ParsedBeatmap, ParsedHitObject } from "../parse/types";
import { providePixi } from "../context/pixi-context";
import HitCircle from "./std/HitCircle.svelte";
import Slider from "./std/Slider.svelte";
import Spinner from "./std/Spinner.svelte";


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

let approachRate: number, preempt: number, fadein: number, fadeOffset: number, scope: number, cs: number;
$: approachRate = beatmap?.Difficulty.ApproachRate ?? 8;
$: preempt = 1200 + (approachRate > 5 ? -150 * (approachRate - 5) : 120 * (5 - approachRate));
$: fadein = 800 + (approachRate > 5 ? -100 * (approachRate - 5) : 80 * (5 - approachRate));
$: fadeOffset = preempt - fadein;
$: scope = preempt * zoom;
$: cs = beatmap?.Difficulty?.CircleSize ?? 4.2;

function objectEnd(object: ParsedHitObject & { length?: number; end?: number }): number {
  return object.end ?? (object.length !== undefined ? object.time + object.length : object.time);
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

function visibleObjectStats(object: ParsedHitObject, index: number, { length: count }: ParsedHitObject[]) {
  const baseAlphaEditor = .3;

  let t = object.time - time;
  if (t > -10 && t < 10) t = -1; // minimal timing errors
  const length = (object as any).length ?? ((object as any).end ?? object.time) - object.time;
  const end = t + length;
  const hit = t <= 0;
  const complete = end <= 0;

  let alpha = 0;
  if (t > preempt)
    // before hit, visible in editor, not in game
    alpha = baseAlphaEditor * (1 + (scope / 2 - t) / scope * 2);
  else if (t > fadeOffset)
    // before hit, during fadein
    alpha = baseAlphaEditor + (1 - baseAlphaEditor) * (1 - (t - fadeOffset) / fadein);
  else if (t <= fadeOffset && end >= 0)
    // fully visible
    alpha = 1;
  else if (end < 0)
    // after end, during fadeout
    alpha = 1 + (end / preempt)
  else if (end < -preempt)
    // after hit, visible in editor, not in game
    alpha = baseAlphaEditor * (1 + (scope / 2 + end) / scope * 2);

  const percent = (end === t) ? hit ? 1 : 0 : (t < 0 && end >= 0) ? 1 - Math.max(0, Math.min(1, end / length)) : 0;
  const approach = t > 0 ? t > preempt ? 0 : 1 - (t / preempt) : 0;

  return { ...object, hit, alpha, approach, percent, complete, cs, zIndex: count - index };
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
  );
  app.resizeTo = container;
  app.resize();
  if (!app.stage.sortableChildren) app.stage.sortableChildren = true;
}

providePixi(() => app, () => app.stage);
</script>

<div bind:this={container} bind:clientHeight bind:clientWidth>
  {#each visibleObjects as object (object.id)}
    {#if object.type === "circle"}
      <HitCircle circle={object} init={object} />
    {:else if object.type === "spinner"}
      <Spinner spinner={object} />
    {:else if object.type === "slider"}
      <Slider slider={object} init={object} />
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
