import { BeatmapObject } from "../types";
import { bitmasks } from "../constants";
import { parseOsuSlider } from "./slider";
import { parseOsuHitSamples } from "./samples";
import { firstFiveAsNumber } from "./util";

export function parseOsuObject(line: string): BeatmapObject {
  const [x, y, time, type_, hitSound, ...rest] =
    line.split(",").map(firstFiveAsNumber) as
      [number, number, number, number, number, ...string[]];
  const newCombo = !!(type_ & bitmasks.newCombo);
  const skipColors = (type_ & bitmasks.skipColors) >> 4;
  const hitSample = parseOsuHitSamples(rest[rest.length - 1]);

  let value: Partial<BeatmapObject>;

  if (type_ & bitmasks.circle) value = { type: "circle" };
  else if (type_ & bitmasks.slider) value = parseOsuSlider(...rest as [string, string, string, string, string]);
  else if (type_ & bitmasks.hold) value = parseOsuHold(rest[0]);
  else if (type_ & bitmasks.spinner) value = parseOsuSpinner(rest[0]);
  else throw new Error(`Invalid object type: "${type_}"`);

  return { ...value, x, y, time, newCombo, skipColors, hitSound, hitSample } as BeatmapObject;
}

export function parseOsuHold(end: string) {
  return { type: "hold", end: +end } as const;
}

export function parseOsuSpinner(end: string) {
  return { type: "spinner", end: +end } as const;
}
