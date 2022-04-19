import { BeatmapObject } from "../../types";
import { serializeCircle } from "./circle";
import { serializeHold } from "./hold";
import { serializeSlider } from "./slider";
import { serializeSpinner } from "./spinner";


export function serializeObject(object: BeatmapObject): string {
  switch (object.type) {
    case "circle": return serializeCircle(object);
    case "slider": return serializeSlider(object);
    case "hold": return serializeHold(object);
    case "spinner": return serializeSpinner(object);
  }
}
