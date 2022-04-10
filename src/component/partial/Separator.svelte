<script lang="ts" context="module">
const keyValues: Record<string, number> = {
  ArrowUp: -.05,
  ArrowLeft: -.05,
  ArrowDown: .05,
  ArrowRight: .05,
  PageUp: -1,
  PageDown: 1,
}
</script>

<script lang="ts">
import { createEventDispatcher, onDestroy } from "svelte";
import Handle from "./Handle.svelte";

export let vertical = false;
export let disabled = false;

let horizontal: boolean;
$: horizontal = !vertical;

let dragging = false;
let dragStart: [number, number] = [0, 0];

const dispatch = createEventDispatcher<{
  step: number;
  drag: { from: number; to: number; by: number; };
}>();

function onKeyDown(e: KeyboardEvent) {
  if (disabled || e.metaKey) return;
  let value = keyValues[e.key];
  if (value === undefined) return;
  if (e.shiftKey) value *= 2;
  if (e.ctrlKey) value *= 5;
  if (e.altKey) value *= .1;
  e.preventDefault();
  dispatch("step", value);
}

function registerDragListeners() {
  window.addEventListener("mousemove", onDrag, { passive: true });
  window.addEventListener("mouseup", onDragEnd);
}

function unregisterDragListeners() {
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", onDragEnd);
}

$: if (dragging) registerDragListeners();
else unregisterDragListeners();

function emitDrag(e: MouseEvent) {
  if (!dragging) return false;
  const from = vertical ? dragStart[0] : dragStart[1];
  const to = vertical ? e.pageX : e.pageY;
  const by = to - from;
  dispatch("drag", { from, to, by });
  return true;
}

function onDragStart(e: MouseEvent) {
  dragStart = [e.pageX, e.pageY];
  dragging = true;
}

function onDrag(e: MouseEvent) {
  emitDrag(e);
}

function onDragEnd(e: MouseEvent) {
  if (emitDrag(e)) dragging = false;
}

onDestroy(unregisterDragListeners);
</script>

<div
  class:horizontal
  class:vertical
  class:disabled
  on:mousedown|preventDefault={onDragStart}
  on:keydown={onKeyDown}
  tabindex={disabled ? null : 0}
>
  <slot>
    <Handle {horizontal} {vertical} {disabled} />
  </slot>
</div>

<style>
div {
  z-index: 1;
  box-sizing: border-box;
  border: 1px solid var(--colorFgDark);
  user-select: none;
  background-color: var(--colorBgLighter);
  position: relative;
}

div:focus {
  outline: var(--outlineFocus);
}

div.vertical {
  cursor: ew-resize;
  border-top: 0;
  border-bottom: 0;
  height: 100%;
  margin: 0 -1px;
}

div.horizontal {
  cursor: ns-resize;
  border-left: 0;
  border-right: 0;
  width: 100%;
  margin: -1px 0;
}

div.disabled {
  cursor: default;
}
</style>
