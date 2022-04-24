import { MapsetStore } from "src/context";
import { floorToMultiple } from "src/util/numbers";

export function getTick(context: MapsetStore, extra = 0): number {
  const time = context.time.get(), timing = context.timing.get();
  const { beatLength, offset, scale } = timing;
  const stepSize = beatLength / scale;
  return floorToMultiple(time + extra * stepSize, stepSize, offset);
}


