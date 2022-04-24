<script lang="ts">
import Icon from "src/component/general/Icon.svelte";
import { OwoId } from "src/icons";

export let heading: string = "Panel";
export let icon: OwoId | undefined = undefined;
</script>

<h3>
  {#if icon}<Icon {icon} />{/if}
  <span>{heading}</span>
  <div>
    <slot />
  </div>
</h3>

<style>
h3 {
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  width: 100%;
}

span {
  padding-left: .3rem;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 40%;
}

div {
  flex-shrink: 0;
}
</style>
