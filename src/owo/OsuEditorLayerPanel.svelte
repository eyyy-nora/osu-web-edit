<script lang="ts">
import OsuAddLayerDialog from "./OsuAddLayerDialog.svelte";
import PanelHeader from "../component/partial/PanelHeader.svelte";
import Button from "../component/form/Button.svelte";
import Panel from "src/component/page/Panel.svelte";
import { BeatmapLayer } from "src/io";
import { getMapsetContext } from "src/context/mapset-context";

const { beatmap, selectLayer, toggleLayerVisible, layer: selectedLayer } = getMapsetContext();

let dialog: OsuAddLayerDialog;

let layers: BeatmapLayer[];
$: layers = $beatmap?.layers ?? [];

function addLayer() {
  dialog.show();
}

</script>


<Panel heading="Layers" icon="layers">
  <PanelHeader icon="layers" heading="Layers" slot="header">
    <Button inline icon="plus" on:click={addLayer} />
  </PanelHeader>
  <ul>
    {#each layers as layer (layer.id)}
      <li class:selected={$selectedLayer === layer} on:click={() => selectLayer(layer)}>
        <Button
          inline
          icon={layer.visible ? "eye" : "eye-slash"}
          on:click={() => toggleLayerVisible(layer)}
        />
        <span>{layer.name}</span>
      </li>
    {/each}
  </ul>
</Panel>

<OsuAddLayerDialog bind:this={dialog} />

<style>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}

li {
  list-style: none;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: .2rem .5rem;
  user-select: none;
  cursor: pointer;
}

li.selected {
  background-color: var(--colorBgLightest);
  color: var(--colorFgLightest);
  cursor: default;
}
</style>
