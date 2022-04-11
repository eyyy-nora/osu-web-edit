<script lang="ts">
import { everyFrame } from "./util/timing";
import OsuEditorRankedArea from "./rendered/std/RankedArea.svelte";
import { downloadMapSet, parseMapSet } from "./parse/parse-osu-file";
import { onDestroy, onMount } from "svelte";
import type { ParsedBeatmap, ParsedMapSet, ParsedTimingPoint, ParsedHitObject, ParsedOsuColors } from "./parse/types";
import type { BeatmapObject } from "./context/beatmap-context";
import Girder from "./component/girder/Girder.svelte";
import ContentBox from "./component/layout/ContentBox.svelte";
import ScreenBox from "./component/layout/ScreenBox.svelte";
import VBox from "./component/layout/VBox.svelte";
import Timeline from "./component/timeline/Timeline.svelte";
import OsuEditorFileMenu from "./owo/OsuEditorFileMenu.svelte";
import OsuEditorStdMapView from "./rendered/OsuEditorStdMapView.svelte";
import { GIRDER_LEFT_WIDTH, GIRDER_RIGHT_WIDTH, local } from "./user-preferences";
import { storedValue } from "./util/stored-value";
import DoubleGirder from "./component/girder/DoubleGirder.svelte";
import { colorToNumber } from "./util/color";

const girderLeftWidth = storedValue(local, GIRDER_LEFT_WIDTH, .25);
const girderRightWidth = storedValue(local, GIRDER_RIGHT_WIDTH, .25);

let mapset: ParsedMapSet;
let selectedDifficulty: ParsedBeatmap;
let time: number = 0;
let audio: HTMLAudioElement | undefined = undefined;
let audioUrl: string | undefined = undefined;

function loadMapSet(parsed: ParsedMapSet) {
  mapset = parsed;
  selectedDifficulty = mapset?.difficulties[0];
  time = selectedDifficulty.TimingPoints[0].time;
  const file = selectedDifficulty.General.AudioFilename;
  const blob = mapset.files[file];
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(blob);
  if (audio) document.body.removeChild(audio);
  audio = document.createElement("audio");
  document.body.appendChild(audio);
  audio.src = audioUrl;
  audio.volume = .1;
}

function adjustTimeToAudio() {
  time = audio.currentTime * 1000;
}

let cancelPlayback: (() => void) | undefined = undefined;
async function audioPlayPause() {
  if (!audio) return;
  if (audio.paused) {
    audio.currentTime = time / 1000;
    cancelPlayback = everyFrame(adjustTimeToAudio);
    await audio.play();
  } else {
    if (cancelPlayback) cancelPlayback();
    await audio.pause();
    adjustTimeToAudio();
  }
}

onMount(async () => loadMapSet(await downloadMapSet("/DotEXE - Battlecry.osz")));
onDestroy(() => cancelPlayback?.());

function onDrop(ev: DragEvent) {
  if (!ev.dataTransfer) return;
  const files = [...ev.dataTransfer.files];
  if (!files.length) return;
  const reader = new FileReader();
  reader.addEventListener("load", (ev) => {
    parseMapSet(ev.target.result as ArrayBuffer).then(loadMapSet);
  });
  reader.readAsArrayBuffer(files[0]);

}

function matchingPoint(timingPoints: ParsedTimingPoint[], time: number) {
  const firstBiggerIndex = timingPoints.findIndex(point => point.time > time);
  if (firstBiggerIndex === -1) return timingPoints[timingPoints.length - 1];
  if (firstBiggerIndex === 0) return timingPoints[0];
  return timingPoints[firstBiggerIndex - 1];
}

const defaultColors: ParsedOsuColors = {
  BackgroundColor: [0, 0, 0],
  Combo1: [64, 0, 0],
  Combo2: [0, 64, 0],
  Combo3: [0, 0, 128],
}

function hitObjectsWithCombos(objects: ParsedHitObject[] = [], colors: ParsedOsuColors = defaultColors): BeatmapObject[] {

  const comboColors = Object.entries(colors).map(([name, color]) => {
    if (!/Combo[0-9]+/g.test(name)) return;
    return color;
  }).filter(it => it);

  let comboIndex = -1;
  const nextColor = () => {
    if (++comboIndex >= comboColors.length) comboIndex = 0;
    return colorToNumber(comboColors[comboIndex]);
  }

  let combo = 1, color = comboColors[0];
  return objects.map((object, index) => {
    if (object.type === "spinner" || object.newCombo) {
      combo = 1;
      color = nextColor();
    }
    return { ...object, index, combo: combo++, color } as BeatmapObject;
  })
}

let timelineObjects: BeatmapObject[];
$: timelineObjects = hitObjectsWithCombos(selectedDifficulty?.HitObjects, selectedDifficulty?.Colours);

let timingPoints: ParsedTimingPoint[], currentTimingPoint: ParsedTimingPoint;
$: timingPoints = selectedDifficulty?.TimingPoints.filter(point => !point.inherited);
$: currentTimingPoint = matchingPoint(timingPoints ?? [], time);

let beatLength: number, offset: number, meter: number;
$: beatLength = currentTimingPoint?.beatLength ?? 200;
$: offset = currentTimingPoint?.time ?? 0;
$: meter = currentTimingPoint?.meter ?? 4;
</script>

<svelte:window on:dragover|preventDefault on:dragenter|capture={() => {}} on:drop|preventDefault={onDrop} />

<main>
  <ScreenBox>
    <VBox>
      <OsuEditorFileMenu on:play-pause={audioPlayPause} />
      <Timeline bind:time bind:beatLength bind:timescaleOffset={offset} bind:meter objects={timelineObjects} zoom={4} />
      <DoubleGirder bind:startDivisor={$girderLeftWidth} bind:endDivisor={$girderRightWidth}>
        <span slot="start">Start</span>
        <ContentBox slot="end">
          {#each mapset?.difficulties ?? [] as difficulty (difficulty.Metadata.BeatmapID ?? difficulty.Metadata.Version)}
            <button type="button" on:click={() => selectedDifficulty = difficulty}>[{difficulty.Metadata.Version}]</button>
          {/each}
        </ContentBox>
        <Girder vertical divisor={.2}>
          <ContentBox>
            <OsuEditorStdMapView beatmap={selectedDifficulty} {time} hitObjects={timelineObjects}>
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
