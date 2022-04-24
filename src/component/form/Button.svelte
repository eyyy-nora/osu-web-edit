<script lang="ts">
import Icon from "src/component/general/Icon.svelte";
import { OwoId } from "src/icons";

export let text: string = undefined;
export let icon: OwoId = undefined;
export let big: boolean = false;
export let pad: boolean = false;
export let inline: boolean = false;

</script>

<button type="button" class:big class:pad class:inline on:click|stopPropagation>
  <slot>
    {#if icon}<Icon {icon} />{/if}
    {#if text}<span>{text}</span>{/if}
  </slot>
</button>

<style>
button {
  max-height: 1.6rem;
  box-sizing: border-box;
  padding: .1rem .5rem;
  border: 1px solid var(--colorFgRegular);
  color: var(--colorFgLight);
  outline: none;
  background-color: var(--colorBgLighter);
  cursor: pointer;
}

button.inline {
  border: none;
  background-color: transparent;
  color: inherit;
  margin: 0;
}

button.pad {
  margin: .2rem .3rem;
}

button.big {
  max-height: 2.4rem;
  padding: .3rem .5rem;
}

button:focus, button:active, button:hover {
  color: var(--colorFgLighter);
  background-color: var(--colorBgLightest);
}
</style>
