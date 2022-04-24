<script lang="ts">
import Button from "src/component/form/Button.svelte";
import { tabInto } from "src/util";
import { tick } from "svelte";
import { fade } from "svelte/transition";
import Portal from "svelte-portal";
declare module "svelte-portal";


let dialog: HTMLElement = undefined;
let restoreFocus: () => void = undefined;

export function hide() {
  open = false;
  restoreFocus?.();
}

export async function show() {
  open = true;
  await tick();
  if (!noFocus) restoreFocus = tabInto(dialog);
}

export let noFocus = false;
export let open = false;
export let closable = false;
export let heading = "Dialog";
</script>

<Portal>
  {#if open}
    <div transition:fade={{ duration: 200 }} class="backdrop" />
    <article bind:this={dialog} transition:fade={{ duration: 200 }} class:open>
      <header>
        <slot name="header">
          <h3>{heading}</h3>
        </slot>
        {#if closable}
          <Button inline big icon="x" on:click={hide} />
        {/if}
      </header>

      <main>
        <slot />
      </main>

      <footer>
        <slot name="footer" />
      </footer>
    </article>
  {/if}
</Portal>

<style>
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
  flex-grow: 0;
  padding: .5rem;
}

footer {
  display: flex;
  flex-direction: row;
  justify-content: end;
  flex-shrink: 0;
  flex-grow: 0;
  padding: .5rem;
}

main {
  padding: 1.5rem;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
}

h3 {
  margin: 0;
  font-size: 1.5rem;
  padding-left: .5rem;
}

article {
  position: absolute;
  padding: .5rem;
  min-width: 30vw;
  max-width: 95vw;
  min-height: 15vh;
  max-height: 95vh;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  transform: translate(-50%, -40%);
  background-color: var(--colorBgRegular);
  border-radius: .3rem;
  box-shadow: var(--shadowHuge);
  transition: transform .2s linear;
  z-index: 10000;
}

article.open {
  transform: translate(-50%, -50%);
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .333);
  z-index: 9999;
}
</style>
