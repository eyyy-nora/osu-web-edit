<script lang="ts">
import { BeatmapLayer } from "src/io";
import { snowflake } from "src/util/snowflake";
import { tick } from "svelte";
import Button from "../component/form/Button.svelte";
import Input from "../component/form/Input.svelte";
import Dialog from "../component/layout/Dialog.svelte";
import { getMapsetContext } from "src/context/mapset-context";

const { beatmap, selectLayer, toggleLayerVisible } = getMapsetContext();

export let open: boolean = false;
export let layerName: string = "";
let dialog: Dialog;
let nameInput: Input;

export async function show() {
  layerName = `Layer ${($beatmap?.layers.length ?? 0) + 1}`;
  dialog.show();
  await tick();
  nameInput.focus();
  nameInput.select();
}

export function hide() {
  dialog.hide();
}

function createLayer() {
  if (!$beatmap) return;
  const layer: BeatmapLayer = {
    name: layerName,
    id: snowflake(),
    objects: []
  };
  $beatmap.layers = [...$beatmap.layers, layer];
  toggleLayerVisible(layer);
  selectLayer(layer);
  hide();
}

</script>

<Dialog bind:this={dialog} closable {open} heading="Create Layer">

  <Input bind:this={nameInput} name="layer-name" bind:value={layerName} />

  <svelte:fragment slot="footer">
    <Button big pad inline text="Close" on:click={hide} />
    <Button disabled={!$beatmap} big pad inline text="Create Layer" on:click={createLayer} />
  </svelte:fragment>
</Dialog>
