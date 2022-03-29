<script lang="ts">
import PixiView from "../component/pixi/PixiView.svelte";
import type { IApplicationOptions } from "pixi.js";

const settings: IApplicationOptions = {
  antialias: true
}

</script>

<PixiView settings={settings} />
