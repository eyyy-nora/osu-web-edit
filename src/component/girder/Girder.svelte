<script lang="ts">
import Separator from "../partial/Separator.svelte";
import { clamp, round } from "../../util/numbers";

export let vertical = false;
export let reverse = false;
export let divisor = .3333;
export let disabled = false;

let container: HTMLDivElement;

function onSeparatorDrag(e: CustomEvent<{ from: number; to: number; by: number; }>) {
  const { to } = e.detail;
  const rect = container.getBoundingClientRect();
  const value = vertical ? (to - rect.top) / rect.height : (to - rect.left) / rect.width;
  divisor = round(clamp(reverse ? value : 1 - value, 0, 1));
}

function onSeparatorStep(e: CustomEvent<number>) {
  divisor = round(clamp(divisor + (reverse ? e.detail : -e.detail)));
}

</script>

<section
  bind:this={container}
  style="--divisor: {divisor * 100}%"
  class:vertical class:reverse class:disabled
>
  <main>
    <slot/>
  </main>

  <Separator
    vertical={!vertical}
    {disabled}
    on:step={onSeparatorStep}
    on:drag={onSeparatorDrag}
  />

  <aside>
    <slot name="side" />
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

section.reverse {
  flex-direction: row-reverse;
}

section.vertical {
  flex-direction: column;
}

section.vertical.reverse {
  flex-direction: column-reverse;
}

.vertical main {
  height: calc(100% - var(--divisor));
}

:not(.vertical) main {
  width: calc(100% - var(--divisor));
}

.vertical aside {
  height: calc(var(--divisor));
}

:not(.vertical) aside {
  width: calc(var(--divisor));
}

main, aside {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}

main, aside {
  box-shadow: var(--shadowInner);
}

</style>
