<script context="module" lang="ts">
import { AssetManager, GameObject } from "black-engine";

type Emitter = (ev: string, ...params: unknown[]) => void;
type GameEvent<Params extends unknown[] = unknown[]> = { stage: EntryPoint, params: Params };

export class EntryPoint extends GameObject {
  assetManager: AssetManager;
  emitter: (event: string) => Emitter;
  constructor(emit: Emitter) {
    super();
    this.emitter = (event: string) => (...params) => emit(event, { stage: this, params });
    this.assetManager = new AssetManager();
    this.assetManager.on("complete", this.emitter("asset-loaded"));
    this.emitter("initialized")();
    this.on("resize", this.emitter("resize"));
    this.onUpdate = this.emitter("update") as any;
  }

  static for(emitter: Emitter, init: (entryPoint: EntryPoint) => void) {
    return class extends EntryPoint {
      constructor() { super(emitter); init(this as EntryPoint); }
    }
  }
}
</script>

<script lang="ts">
import { Engine, CanvasDriver, StageScaleMode, Input } from "black-engine";
import { provideBlack } from "src/context";
import { snowflake } from "src/util/snowflake";
import { createEventDispatcher, onDestroy } from "svelte";

export let engine: Engine = undefined;
export let stage: GameObject = undefined;
export let width = 800, height = 600;
export let pauseOnBlur = true, pauseOnHide = true;

const id = snowflake();
let container: HTMLDivElement = undefined;
let clientWidth = 0, clientHeight = 0;

let resolveEngine: (engine: Engine) => void;
const enginePromise: Promise<Engine> = new Promise((resolve) => {
  resolveEngine = resolve;
});

const emit = createEventDispatcher<{
  "asset-loaded": GameEvent,
  "resize": GameEvent,
  "update": GameEvent<[]>,
}>();

function init(entryPoint: EntryPoint) {
  stage = entryPoint as GameObject;
  resolveEngine(engine);
}


$: if (container) engine = new Engine(
  id,
  EntryPoint.for(emit, init),
  CanvasDriver,
  [Input],
);

$: if (engine) {
  engine.start();
  engine.stage.setSize(width, height);
  engine.stage.scaleMode = (StageScaleMode as any).LETTERBOX;
  engine.pauseOnBlur = pauseOnBlur;
  engine.pauseOnHide = pauseOnHide;
  Object.assign(window, { engine });
}

$: if (clientWidth && clientHeight) engine?.viewport?.refresh();

provideBlack(() => enginePromise, () => stage as any);

onDestroy(() => {
  engine?.destroy();
})

</script>

<div {id} bind:this={container} bind:clientHeight bind:clientWidth>
  <slot />
</div>


<style>
div {
  margin: 0 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
