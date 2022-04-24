<script lang="ts">
import Icon from "src/component/general/Icon.svelte";
import Panel from "src/component/page/Panel.svelte";
import { Beatmap } from "src/io";
import { getMapsetContext } from "src/context/mapset-context";

const { beatmap: selectedBeatmap, selectBeatmap, mapset } = getMapsetContext();

function modePriority(map: Beatmap): number {
  switch (map.general.mode) {
    case "osu": return 1;
    case "mania": return 2;
    case "ctb": return 3;
    case "taiko": return 4;
  }
}

let beatmaps: { map: Beatmap, selected: boolean }[];
$: beatmaps = $mapset?.beatmaps
  .sort((a, b) => modePriority(a) - modePriority(b))
  .map(map => ({ map, selected: $selectedBeatmap === map })) ?? [];

</script>


<Panel heading="Beatmaps" icon="collection">
  <ul>
    {#each beatmaps as { map, selected } (map)}
      <li class:selected on:click={() => selected || selectBeatmap(map)}>
        <Icon icon={map.general.mode} />
        <span>{map.metadata.version}</span>
      </li>
    {/each}
  </ul>
</Panel>

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
