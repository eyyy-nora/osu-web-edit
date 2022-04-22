<script lang="ts">
import Button from "../component/form/Button.svelte";
import Panel from "../component/layout/Panel.svelte";
import { BeatmapLayer } from "src/io";
import { getMapsetContext } from "src/context/mapset-context";

const { beatmap, selectLayer, toggleLayerVisible, visibleLayers, layer: selectedLayer } = getMapsetContext();


let layers: { layer: BeatmapLayer, visible: boolean }[];
$: layers = $beatmap?.layers.map(layer => ({
  layer,
  visible: $visibleLayers.includes(layer),
})) ?? [];

</script>


<Panel heading="Layers" icon="layers">
  <ul>
    {#each layers as { layer, visible } (layer.id)}
      <li class:selected={$selectedLayer === layer} on:click={() => selectLayer(layer)}>
        <span>{layer.name}</span>
        <Button icon={visible ? "visible" : "invisible"} on:click={() => toggleLayerVisible(layer)} />
      </li>
    {/each}
  </ul>
</Panel>

<style>
ul {
  list-style: none;
  padding: 0;
  position: relative;
}

li {
  list-style: none;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: .2rem 1rem;
  user-select: none;
  cursor: pointer;
}

span {
  padding-left: .5rem;
}

li.selected {
  background-color: var(--colorBgLightest);
  color: var(--colorFgLightest);
  cursor: default;
}
</style>
