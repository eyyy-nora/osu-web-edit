<script lang="ts">
  import Panel from "src/component/page/Panel.svelte";
  import Stage from "src/component/blacksmith/Stage.svelte";
  import { osuVisibleArea } from "src/constants";
  import { createMapsetContext } from "src/context";
  import { withFileDialog } from "src/util/open-file-dialog";
  import { debuffer } from "src/util/timing";
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
  import { Beatmap } from "./io";

  const girderLeftWidth = storedValue(local, GIRDER_LEFT_WIDTH, 0.25);
  const girderRightWidth = storedValue(local, GIRDER_RIGHT_WIDTH, 0.25);

  const { beatmap, time, loadMapset, goto } = createMapsetContext();

  const replaceUrl = debuffer(function (beatmap: Beatmap, time: number) {
    if (!beatmap) return;
    const { beatmapSetID, beatmapID, title, version } = beatmap.metadata;
    const mapset = beatmapSetID ? `osu:${beatmapSetID}` : `local:${title}`;
    const difficulty = beatmapID ?? version;
    const path = `/${mapset}/${difficulty}/${Math.floor(+time)}`;
    history.replaceState(null, "", path);
  });

  $: replaceUrl($beatmap, $time);

  onMount(async () => {
    const path = location.pathname
      .split("/")
      .map((it) => it.trim())
      .filter((it) => it);
    if (path.length > 0) {
      const [mapset, beatmapId, time] = path;
      let [type, mapsetId] = mapset.split(":");
      if (!mapsetId) {
        mapsetId = type;
        type = "osu";
      }
      switch (type) {
        case "local":
          await withFileDialog((mapset) => loadMapset(mapset, beatmapId));
          break;
        case "osu":
          await loadMapset(`https://api.chimu.moe/v1/download/${mapsetId}`, beatmapId);
          break;
      }
      goto(+(time ?? 0));
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
      <Timeline />
      <DoubleGirder bind:startDivisor={$girderLeftWidth} bind:endDivisor={$girderRightWidth}>
        <ContentBox slot="start">
          <Panel heading="Elements" icon="osu-ring">Circle, Slider, Spinner, etc.</Panel>
        </ContentBox>
        <ContentBox slot="end">
          <OsuEditorLayerPanel />
          <OsuEditorBeatmapsPanel />
        </ContentBox>
        <Girder vertical divisor={0.2}>
          <ContentBox>
            <Stage {...osuVisibleArea}>
              <OsuEditorStdMapView />
            </Stage>
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

    --colorBgLightest: #565762;
    --colorBgLighter: #3e3d3f;
    --colorBgLight: #38373a;
    --colorBgRegular: #2f2e30;
    --colorBgDark: #262628;
    --colorBgDarker: #1d1e1e;
    --colorBgDarkest: #131214;

    --colorFgLightest: #d0d0d3;
    --colorFgLighter: #b9b9c0;
    --colorFgLight: #959a9b;
    --colorFgRegular: #7c8181;
    --colorFgDark: #666a6b;
    --colorFgDarker: #535357;
    --colorFgDarkest: #454346;

    --shadowTiny: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadowSmall: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadowRegular: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadowLarge: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadowLarger: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadowHuge: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --shadowInner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

    --bgHandle: repeat 0% 0%/6px 6px radial-gradient(var(--colorFgRegular) 1px, transparent 1px);
    --outlineFocus: 0.1rem solid #5c8ce0;
    --fontMono: ui-monospace, "Fira Code", "FuraCode NF", "Source Code Pro", "Cascadia Mono", "Segoe UI Mono", Menlo, Monaco, "SF Mono",
      Consolas, "Ubuntu Mono", "Roboto Mono", "DejaVu Sans Mono", "Courier New", monospace;
  }
</style>
