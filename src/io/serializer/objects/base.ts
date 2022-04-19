import { BeatmapObject } from "../../types";
import { bitmasks } from "../../constants";

export function serializeObjectBase(base: BeatmapObject): string {
  let flags = base.type === "circle" ? bitmasks.circle
    : base.type === "slider" ? bitmasks.slider
      : base.type === "hold" ? bitmasks.hold : bitmasks.spinner;

  if (base.newCombo) flags |= bitmasks.newCombo;
  if (base.skipColors) flags |= base.skipColors << 4;

  return [base.x, base.y, base.time, flags, base.hitSound].join(",");
}
