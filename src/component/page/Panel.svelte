<script lang="ts">
import PanelHeader from "src/component/partial/PanelHeader.svelte";
import Icon from "src/component/general/Icon.svelte";
import { OwoId } from "src/icons";



function expand(node, { vertical = false, delay = 0, duration = 150 }) {
  const base = vertical ? node.clientHeight : node.clientWidth;

  return {
    delay,
    duration,
    css: vertical ? t => `max-height: ${base * t}px` : t => `max-width: ${base * t}px`,
  }
}

export let open: boolean = true;
export let heading: string = "Panel";
export let icon: OwoId | undefined = undefined;
</script>

<article>
  <header on:click|preventDefault={() => open = !open}>
    <slot name="header">
      <PanelHeader {heading} {icon} />
    </slot>
    <Icon icon={open ? "chevron-contract" : "chevron-expand"} />
  </header>
  {#if open}
    <main transition:expand={{ vertical: true }}>
      <slot />
    </main>
  {/if}
</article>


<style>
header {
  padding: .1rem .8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: var(--colorBgLight);
  box-shadow: var(--shadowRegular);
  cursor: pointer;
  color: var(--colorFgLight);
  user-select: none;
}

article {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: stretch;
}

main {
  overflow: hidden;
  padding: .1rem 0;
}
</style>
