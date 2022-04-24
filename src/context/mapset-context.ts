import { actions } from "src/actions";
import { getContext, onDestroy, setContext } from "svelte";
import { createMapsetStore } from "./mapset";



const MAPSET_CONTEXT = {};

export function createMapsetContext() {
  const context = createMapsetStore();
  setContext(MAPSET_CONTEXT, context);
  onDestroy(context.destroy);
  actions.registerContext("mapset", context);
  return context;
}

export function getMapsetContext(): ReturnType<typeof createMapsetContext> {
  return getContext(MAPSET_CONTEXT);
}
