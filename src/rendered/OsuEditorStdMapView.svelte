<script lang="ts" context="module">
import { GameObject, Graphics } from "black-engine";
import { osuRankableArea, osuVisibleArea } from "src/constants";
import { BeatmapObjectWithCombo } from "src/context";

const { width: rankedWidth, height: rankedHeight } = osuRankableArea;
const { width: visibleWidth, height: visibleHeight } = osuVisibleArea;
const xOffset = (visibleWidth - rankedWidth) / 2;
const yOffset = (visibleHeight - rankedHeight) / 2;

export class OsuEditorStdStage extends GameObject {
  rankedArea: Graphics;

  public onAdded() {
    this.rankedArea = new Graphics();
    this.add(this.rankedArea);
  }

  protected onUpdate() {
    this.mChildren.sort((a, b) => ((a as any).zIndex ?? 0) - ((b as any).zIndex ?? 0));

    this.alignPivotOffset(0, 0, false);
    this.width = rankedWidth;
    this.height = rankedHeight;
    this.x = xOffset;
    this.y = yOffset;
    this.scaleX = this.scaleY = 1;

    const g = this.rankedArea;
    g.clear();
    g.lineStyle(2, 0xffffff, 1);

    g.beginPath();
    g.rect(0, 0, rankedWidth, rankedHeight);
    g.stroke();
  }
}
</script>

<script lang="ts">
import { getMapsetContext, pushBlackStage } from "src/context";
import { BeatmapObject } from "src/io";
import { BeatmapObjectWithStdProps } from "src/rendered/std/types";
import HitCircle from "./std/HitCircle.svelte";
import Slider from "./std/Slider.svelte";
import Spinner from "./std/Spinner.svelte";

const { beatmap, objects, time } = getMapsetContext();

export let zoom: number = 2;

let approachRate: number, preempt: number, fadein: number, fadeOffset: number, scope: number, cs: number;
$: approachRate = $beatmap?.difficulty.approachRate ?? 8;
$: preempt = 1200 + (approachRate > 5 ? -150 * (approachRate - 5) : 120 * (5 - approachRate));
$: fadein = 800 + (approachRate > 5 ? -100 * (approachRate - 5) : 80 * (5 - approachRate));
$: fadeOffset = preempt - fadein;
$: scope = preempt * zoom;
$: cs = $beatmap?.difficulty?.circleSize ?? 4.2;

function objectEnd(object: BeatmapObjectWithCombo & { length?: number; end?: number }): number {
  return object.end ?? (object.length !== undefined ? object.time + object.length : object.time);
}

function objectInRange(object: BeatmapObjectWithCombo, start: number, end: number): boolean {
  return objectEnd(object) >= start && object.time <= end;
}

function filterInRange(objects: BeatmapObjectWithCombo[], start: number, end: number, sections = 10): BeatmapObjectWithCombo[] {
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

function objectLength(object: BeatmapObjectWithCombo) {
  if ("length" in object) return object.length * object.sv;
  if ("end" in object) return object.end - object.time;
  return 0;
}

function visibleObjectStats(object: BeatmapObjectWithCombo, index: number, { length: count }: BeatmapObjectWithStdProps[]) {
  const baseAlphaEditor = .1;

  let t = object.time - $time;
  if (t > -10 && t < 10) t = -1; // minimal timing errors
  const length =  objectLength(object);
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

let visibleObjects: (BeatmapObject & any)[];
$: visibleObjects = filterInRange($objects, $time - scope, $time + scope).map(visibleObjectStats).reverse();

pushBlackStage(new OsuEditorStdStage());
</script>

{#each visibleObjects as object (object.id)}
  {#if object.type === "circle"}
    <HitCircle circle={object} />
  {:else if object.type === "spinner"}
    <Spinner spinner={object} />
  {:else if object.type === "slider"}
    <Slider slider={object} />
  {/if}
{/each}
