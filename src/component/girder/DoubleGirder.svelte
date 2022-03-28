<script lang="ts">
import Separator from "../partial/Separator.svelte";
import { clamp, round } from "../../util/numbers";

export let vertical = false;
export let disabled = false;
export let startDivisor: number = .25;
export let endDivisor: number = .25;

let container: HTMLDivElement;

function onSeparatorDrag(index: number, to: number) {
  const rect = container.getBoundingClientRect();
  const value = vertical ? (to - rect.top) / rect.height : (to - rect.left) / rect.width;
  if (index === 0) startDivisor = clamp(round(value), 0, 1 - endDivisor);
  else endDivisor = clamp(round(1 - value), 0, 1 - startDivisor);
}

function onSeparatorStep(index: number, value: number) {
  if (index === 0) startDivisor = clamp(round(startDivisor + value), 0, 1 - endDivisor);
  else endDivisor = clamp(round(endDivisor - value), 0, 1 - startDivisor);
}

</script>

<section
  bind:this={container}
  class:vertical class:disabled
>

  <aside style="--divisor: {startDivisor * 100}%">
    <slot name="start" />
  </aside>

  <Separator
    {disabled}
    vertical={!vertical}
    on:step={(e) => onSeparatorStep(0, e.detail)}
    on:drag={(e) => onSeparatorDrag(0, e.detail.to)}
  />

  <main style="--divisor: {(1 - (startDivisor + endDivisor)) * 100}%;">
    <slot/>
  </main>

  <Separator
    {disabled}
    vertical={!vertical}
    on:step={(e) => onSeparatorStep(1, e.detail)}
    on:drag={(e) => onSeparatorDrag(1, e.detail.to)}
  />

  <aside style="--divisor: {endDivisor * 100}%">
    <slot name="end" />
  </aside>
</section>

<style>

section {
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}

section.vertical {
  flex-direction: column;
}

.vertical main {
  height: var(--divisor);
}

:not(.vertical) main {
  width: var(--divisor);
}

.vertical aside {
  height: var(--divisor);
}

:not(.vertical) aside {
  width: var(--divisor);
}

main, aside {
  position: relative;
  box-sizing: border-box;
}

main, aside {
  box-shadow: var(--shadowInner);
}

</style>
