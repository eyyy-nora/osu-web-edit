<script lang="ts">
import { getMapsetContext, BeatmapObjectWithCombo } from "src/context";
import { BeatmapObject } from "src/io";
import TimelineSlider from "./TimelineSlider.svelte";
import TimelineSpinner from "./TimelineSpinner.svelte";
import TimelineCircle from "./TimelineCircle.svelte";
import { clamp, floorToMultiple, round } from "src/util/numbers";


const { time, goto, timing, objects, zoom, scale: scaleLevel, timeFormatted } = getMapsetContext();

let beatLength: number, offset: number, meter: number, scale: number;
$: ({ beatLength, offset, meter, scale } = $timing)

let clientWidth: number = 0;

let range: number, rangeStart: number, rangeEnd: number, rangeScale: number;
$: rangeScale = Math.pow(2, $zoom);
$: range = (beatLength * rangeScale);
$: rangeStart = Math.max(-range * .5, $time - range / 2);
$: rangeEnd = rangeStart + range;

let beatWidth: number, beatOffset: number;
$: beatWidth = clientWidth / rangeScale;
$: beatOffset = ($time - offset) / beatLength;

let smallestDivisor: number;
$: smallestDivisor = beatLength / scale;

function startAndEndTime(object: BeatmapObjectWithCombo) {
  const time = (object.time - rangeStart) / range;
  const end = (objectEnd(object) - rangeStart) / range;
  return { time, end };
}

function objectEnd(object: BeatmapObjectWithCombo & { length?: number; end?: number }): number {
  return object.end ?? object.time + object.absoluteLength;
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

let visibleObjects: BeatmapObjectWithCombo[];
$: visibleObjects = filterInRange($objects, rangeStart, rangeEnd);

export function scaleBy(levels: number) {
  $scaleLevel = clamp($scaleLevel + levels, 0, 9);
}

export function scrollBy(steps: number) {
  goto($time + steps * smallestDivisor, true);
}

export function zoomBy(steps: number) {
  $zoom = clamp($zoom + steps * .5, 0, 8);
}

function onScroll(e: WheelEvent) {
  const delta = (e.deltaY || e.deltaX)
  if (e.ctrlKey || e.metaKey) zoomBy(delta > 0 ? 1 : -1);
  else if (e.shiftKey) scaleBy(delta < 0 ? 1 : -1);
  else scrollBy(delta > 0 ? 1 : -1);
}
</script>

<article>
  <div class="container" on:wheel|preventDefault={onScroll}>
    <div class="inner" style="--timelineSize: {clientWidth ?? 0}px; --beatWidth: {beatWidth}px; --beatOffset: {-beatOffset}" bind:clientWidth={clientWidth}>
      <div
        class="timescale divisor{scale}"
      />
      {#each visibleObjects as object (object.id)}
        {#if object.type === "circle"}
          <TimelineCircle {...startAndEndTime(object)} {object} />
        {:else if object.type === "slider"}
          <TimelineSlider {...startAndEndTime(object)} {object} />
        {:else if object.type === "spinner"}
          <TimelineSpinner {...startAndEndTime(object)} />
        {/if}
      {/each}
    </div>
    <div class="info">
      <span>scale: 1/{scale}</span>
      <span>zoom: {8 - $zoom}</span>
      <span>{$timeFormatted}</span>
    </div>
  </div>
  <div class="shadow" />
</article>

<style>
article {
  position: relative;
  background-color: var(--colorBgLighter);
  border-bottom: 1px solid var(--colorFgDark);
  user-select: none;
  --beatWidth: 0px;
  --beatOffset: 0;
}

.container {
  position: relative;
  height: 3.2rem;
  margin: .2rem;
  border-radius: .35rem;
  background-color: var(--colorBgDarkest);
  overflow: hidden;
}

.inner {
  height: 100%;
  margin: 0 -15rem;
  position: relative;
}

.info {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 5rem;
  display: flex;
  flex-direction: column;
  padding: 0 1rem .2rem .5rem;
  font-size: .8em;
  font-weight: bold;
  color: var(--colorFgLight);
  background-color: var(--colorBgDarker);
  border-bottom-left-radius: .2rem;
  box-shadow: var(--shadowRegular);
  overflow: hidden;
}

.shadow {
  height: 3.2rem;
  margin: .2rem;
  border-radius: .35rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  pointer-events: none;
  box-shadow:
    inset 24px 0 12px -12px var(--colorBgDarker),
    inset -24px 0 12px -12px var(--colorBgDarker),
    var(--shadowInner),
    var(--shadowInner);
}

.timescale {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-position-x: calc(50% + var(--beatWidth) * var(--beatOffset) - 1px);
  background-position-y: bottom;
  background-size: var(--beatWidth) 100%;
  background-repeat: repeat no-repeat;
  transition: background-position .12s ease-out, opacity .15s ease-out;
  --color1Tick: rgba(255, 255, 255, 1);
  --color2Tick: rgba(239, 78, 78, 1);
  --color3Tick: rgba(239, 78, 78, 1);
  --color4Tick: rgba(130, 130, 245, 1);
  --color6Tick: rgba(130, 130, 245, 1);
  --color8Tick: rgba(176, 176, 87, 1);
  --color16Tick: rgba(127, 127, 127, 1);
  --color24Tick: rgba(127, 127, 127, 1);
  --color32Tick: rgba(64, 64, 64, 1);

  --scale1: linear-gradient(
    to right,
    transparent calc(var(--beatWidth) / 2),
    var(--color1Tick) calc(var(--beatWidth) / 2),
    transparent calc(var(--beatWidth) / 2 + 2px),
    transparent var(--beatWidth)
  );
  --scale1size: var(--beatWidth) 100%;
  --scale2: linear-gradient(
    to right,
    var(--color2Tick) 0,
    transparent 2px,
    transparent var(--beatWidth)
  );
  --scale2size: var(--beatWidth) 80%;
  --scale3: linear-gradient(
    to right,
    transparent       calc(var(--beatWidth) / 6),
    var(--color3Tick) calc(var(--beatWidth) / 6),
    transparent       calc(var(--beatWidth) / 6 + 2px),
    transparent       calc(var(--beatWidth) / 3)
  );
  --scale3size: calc(var(--beatWidth) / 3) 80%;
  --scale4: linear-gradient(
    to right,
    var(--color4Tick) 0,
    transparent       2px,
    transparent       calc(var(--beatWidth) / 2)
  );
  --scale4size: calc(var(--beatWidth) / 2) 60%;
  --scale6: linear-gradient(
    to right,
    var(--color6Tick) 0,
    transparent       2px,
    transparent       calc(var(--beatWidth) / 3)
  );
  --scale6size: calc(var(--beatWidth) / 3) 60%;
  --scale8: linear-gradient(
    to right,
    var(--color8Tick) 0,
    transparent       2px,
    transparent       calc(var(--beatWidth) / 4)
  );
  --scale8size: calc(var(--beatWidth) / 4) 40%;
  --scale12: linear-gradient(
    to right,
    var(--color8Tick)  0,
    transparent        2px,
    transparent        calc(var(--beatWidth) / 6)
  );
  --scale12size: calc(var(--beatWidth) / 6) 40%;
  --scale16: linear-gradient(
    to right,
    var(--color16Tick) 0,
    transparent        2px,
    transparent        calc(var(--beatWidth) / 8)
  );
  --scale16size:       calc(var(--beatWidth) / 8) 40%;
  --scale24: linear-gradient(
    to right,
    var(--color24Tick) 0,
    transparent        2px,
    transparent        calc(var(--beatWidth) / 12)
  );
  --scale24size:       calc(var(--beatWidth) / 12) 40%;
  --scale32: linear-gradient(
    to right,
    var(--color32Tick) 0,
    transparent        2px,
    transparent        calc(var(--beatWidth) / 16)
  );
  --scale32size:       calc(var(--beatWidth) / 16) 40%;

}

.timescale.divisor1 {
  background-image: var(--scale1);
  background-size: var(--scale1size);
}

.timescale.divisor2 {
  background-image: var(--scale1), var(--scale2);
  background-size: var(--scale1size), var(--scale2size);
}

.timescale.divisor3 {
  background-image: var(--scale1), var(--scale3);
  background-size: var(--scale1size), var(--scale3size);
}

.timescale.divisor4 {
  background-image: var(--scale1), var(--scale2), var(--scale4);
  background-size: var(--scale1size), var(--scale2size), var(--scale4size);
}

.timescale.divisor6 {
  background-image: var(--scale1), var(--scale3), var(--scale6);
  background-size: var(--scale1size), var(--scale3size), var(--scale6size);
}

.timescale.divisor8 {
  background-image: var(--scale1), var(--scale2), var(--scale4), var(--scale8);
  background-size: var(--scale1size), var(--scale2size), var(--scale4size), var(--scale8size);
}

.timescale.divisor12 {
  background-image: var(--scale1), var(--scale3), var(--scale6), var(--scale12);
  background-size: var(--scale1size), var(--scale3size), var(--scale6size), var(--scale12size);
}

.timescale.divisor16 {
  background-image: var(--scale1), var(--scale2), var(--scale4), var(--scale8), var(--scale16);
  background-size: var(--scale1size), var(--scale2size), var(--scale4size), var(--scale8size), var(--scale16size);
}

.timescale.divisor24 {
  background-image: var(--scale1), var(--scale3), var(--scale6), var(--scale12), var(--scale24);
  background-size: var(--scale1size), var(--scale3size), var(--scale6size), var(--scale12size), var(--scale24size);
}

.timescale.divisor32 {
  background-image: var(--scale1), var(--scale2), var(--scale4), var(--scale8), var(--scale16), var(--scale32);
  background-size: var(--scale1size), var(--scale2size), var(--scale4size), var(--scale8size), var(--scale16size), var(--scale32size);
}

</style>
