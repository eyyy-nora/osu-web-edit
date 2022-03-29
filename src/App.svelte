<script lang="ts">
import type { BeatmapObject } from "./context/beatmap-context";
import Girder from "./component/girder/Girder.svelte";
import ContentBox from "./component/layout/ContentBox.svelte";
import ScreenBox from "./component/layout/ScreenBox.svelte";
import VBox from "./component/layout/VBox.svelte";
import Timeline from "./component/timeline/Timeline.svelte";
import OsuEditorFileMenu from "./owo/OsuEditorFileMenu.svelte";
import OsuEditorMapView from "./owo/OsuEditorMapView.svelte";
import { GIRDER_LEFT_WIDTH, GIRDER_RIGHT_WIDTH, local } from "./user-preferences";
import { storedValue } from "./util/stored-value";
import DoubleGirder from "./component/girder/DoubleGirder.svelte";

const girderLeftWidth = storedValue(local, GIRDER_LEFT_WIDTH, .25);
const girderRightWidth = storedValue(local, GIRDER_RIGHT_WIDTH, .25);
const timelineObjects: BeatmapObject[] = [
  {
    type: "circle",
    start: 0,
    position: { x: 0, y: 0 },
  }, {
    type: "circle",
    start: 10,
    position: { x: 0, y: 0 },
  }, {
    type: "circle",
    start: 20,
    position: { x: 0, y: 0 },
  }, {
    type: "circle",
    start: 30,
    position: { x: 0, y: 0 },
  }, {
    type: "slider",
    start: 50,
    position: { x: 0, y: 0 },
    velocity: 1,
    beats: 5
  }
];
timelineObjects.forEach((object, index) => Object.assign(object, { index }));
</script>

<main>
  <ScreenBox>
    <VBox>
      <OsuEditorFileMenu />
      <Timeline beatLength={10} objects={timelineObjects} zoom={4} />
      <DoubleGirder bind:startDivisor={$girderLeftWidth} bind:endDivisor={$girderRightWidth}>
        <span slot="start">Start</span>
        <span slot="end">End</span>
        <Girder vertical divisor={.2}>
          <ContentBox>
            <OsuEditorMapView />
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
  margin: 0;
  padding: 0;

  background-color: var(--colorBgRegular);
  color: var(--colorFgRegular);

  --colorBgLightest: #6b6c7a;
  --colorBgLighter: #585a5d;
  --colorBgLight: #3c3f41;
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
