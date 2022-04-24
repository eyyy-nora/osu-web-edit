import { contextAction } from "../actions";
import { getTick } from "./util";
import { MapsetStore } from "src/context";



export function nextTick(context: MapsetStore) {
  context.goto(getTick(context, 1));
}

export function prevTick(context: MapsetStore) {
  context.goto(getTick(context, -1));
}

contextAction("nav-next-tick", nextTick, "mapset");
contextAction("nav-prev-tick", prevTick, "mapset");
