<script lang="ts">
import Panel from "./component/layout/Panel.svelte";
import { createMapsetContext } from "./context/mapset-context";
import OsuEditorRankedArea from "./rendered/std/RankedArea.svelte";
import { onMount } from "svelte";
import Girder from "./component/girder/Girder.svelte";
import ContentBox from "./component/layout/ContentBox.svelte";
import ScreenBox from "./component/layout/ScreenBox.svelte";
import VBox from "./component/layout/VBox.svelte";
import Timeline from "./component/timeline/Timeline.svelte";
import OsuEditorFileMenu from "./owo/OsuEditorFileMenu.svelte";
import OsuEditorLayerPanel from "./owo/OsuEditorLayerPanel.svelte";
import OsuEditorBeatmapsPanel from "./owo/OsuEditorBeatmapsPanel.svelte";
import OsuEditorStdMapView from "./rendered/OsuEditorStdMapView.svelte";
import { GIRDER_LEFT_WIDTH, GIRDER_RIGHT_WIDTH, local } from "./user-preferences";
import { storedValue } from "./util/stored-value";
import DoubleGirder from "./component/girder/DoubleGirder.svelte";

const girderLeftWidth = storedValue(local, GIRDER_LEFT_WIDTH, .25);
const girderRightWidth = storedValue(local, GIRDER_RIGHT_WIDTH, .25);

const {
  mapset,
  beatmap,
  time,
  loadMapset,
  objects,
} = createMapsetContext();

onMount(() => {
  const path = location.pathname.split("/").map(it => it.trim()).filter(it => it);
  if (path.length > 0) {
    const [mapsetId, beatmapId] = path;
    loadMapset(`https://api.chimu.moe/v1/download/${mapsetId}`, beatmapId);
  }
});

function onDrop(ev: DragEvent) {
  if (!ev.dataTransfer) return;
  const files = [...ev.dataTransfer.files];
  if (!files.length) return;
  loadMapset(files[0]);
}

</script>

<svelte:window on:dragover|preventDefault on:dragenter|capture={() => {}} on:drop|preventDefault={onDrop} />

<main>
  <ScreenBox>
    <VBox>
      <OsuEditorFileMenu />
      <Timeline objects={$objects} zoom={4} />
      <DoubleGirder bind:startDivisor={$girderLeftWidth} bind:endDivisor={$girderRightWidth}>
        <ContentBox slot="start">
          <Panel heading="Elements" icon="osu-ring">
            Circle, Slider, Spinner, etc.
          </Panel>
        </ContentBox>
        <ContentBox slot="end">
          <OsuEditorLayerPanel />
          <OsuEditorBeatmapsPanel />
        </ContentBox>
        <Girder vertical divisor={.2}>
          <ContentBox>
            <OsuEditorStdMapView beatmap={$beatmap} time={$time} hitObjects={$objects}>
              <OsuEditorRankedArea />
            </OsuEditorStdMapView>
          </ContentBox>
          <span slot="side">Properties</span>
        </Girder>
      </DoubleGirder>
    </VBox>
  </ScreenBox>
</main>

<style>
main {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

:global(body) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  background-color: var(--colorBgRegular);
  color: var(--colorFgRegular);

  --colorBgLightest: #6b6c7a;
  --colorBgLighter: #585a5d;
  --colorBgLight: #484a4d;
  --colorBgRegular: #3c3f41;
  --colorBgDark: #2d2f31;
  --colorBgDarker: #2b2b2c;
  --colorBgDarkest: #2a282b;

  --colorFgLightest: #d0d0d3;
  --colorFgLighter: #b9b9c0;
  --colorFgLight: #959a9b;
  --colorFgRegular: #7c8181;
  --colorFgDark: #6e7273;
  --colorFgDarker: #5d5d62;
  --colorFgDarkest: #504c50;

  --shadowTiny: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadowSmall: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadowRegular: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadowLarge: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadowLarger: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadowHuge: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadowInner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

  --bgHandle: repeat 0% 0%/6px 6px radial-gradient(var(--colorFgRegular) 1px, transparent 1px);
  --outlineFocus: .1rem solid #5c8ce0;
  --fontMono: ui-monospace, "Fira Code", "FuraCode NF", "Source Code Pro", "Cascadia Mono", "Segoe UI Mono", Menlo, Monaco, "SF Mono", Consolas, "Ubuntu Mono", "Roboto Mono", "DejaVu Sans Mono", "Courier New", monospace;
}
</style>
