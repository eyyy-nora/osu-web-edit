import { contextAction } from "../actions";
import { MapsetStore } from "src/context";

export function nextObject(context: MapsetStore) {
  const time = context.time.get();
  const next = context.objects.get().find(object => object.time > time)?.time;
  if (next == undefined) return;
  context.goto(next);
}

export function prevObject(context: MapsetStore) {
  const time = context.time.get();
  const prev = context.objects.get().slice().reverse().find(object => object.time < time)?.time;
  if (prev == undefined) return;
  context.goto(prev);
}

contextAction("nav-next-object", nextObject, "mapset");
contextAction("nav-prev-object", prevObject, "mapset");
