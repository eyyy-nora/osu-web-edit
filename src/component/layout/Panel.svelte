<script lang="ts">
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
    <h3>
      {#if icon}
        <i class="icon icon-{icon}"/>
      {/if}
      {heading}
    </h3>
    <i class="icon icon-chevron-{open ? 'contract' : 'expand'}" />
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

h3 {
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
}

article {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: stretch;
}

main {
  overflow: hidden;
  padding-top: .3rem;
}
</style>
