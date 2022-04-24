import { contextAction } from "../actions";
import { MapsetStore } from "src/context";



export function nextTimingPoint(context: MapsetStore) {
  const time = context.time.get();
  const timingPoints = context.beatmap.get()?.timingPoints ?? [];
  if (!timingPoints.length) return;
  const next = timingPoints.find(it => it.time > time)?.time;
  if (next == undefined) return;
  context.goto(next);
}

export function prevTimingPoint(context: MapsetStore) {
  const time = context.time.get();
  const timingPoints = context.beatmap.get()?.timingPoints ?? [];
  if (!timingPoints.length) return;
  const prev = timingPoints.slice().reverse().find(it => it.time < time)?.time;
  if (prev == undefined) return;
  context.goto(prev);
}

contextAction("nav-next-timing-point", nextTimingPoint, "mapset");
contextAction("nav-prev-timing-point", prevTimingPoint, "mapset");
