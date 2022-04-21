import { derived, Readable } from "src/context/stores";
import {
  Beatmap,
  BeatmapTimingPoint,
  BeatmapUninheritedTimingPoint
} from "src/io";


const defaultTiming = {
  beatLength: 200,
  offset: 0,
  meter: 4,
}

export function createTimingStore($beatmap: Readable<Beatmap>, $time: Readable<number>) {
  return derived([$beatmap, $time], ([beatmap, time]) => {
    const timingPoints = $beatmap.get()?.timingPoints;
    if (!timingPoints || !timingPoints.length) return defaultTiming;

    const inherited = matchingTimingPoint(timingPoints.filter(it => it.inherited), time);
    const uninherited = matchingTimingPoint(timingPoints.filter(it => !it.inherited), time) as BeatmapUninheritedTimingPoint;

    const {
      beatLength = 200,
      time: offset = 0,
      meter = 4,
    } = uninherited;

    return {
      beatLength,
      offset,
      meter,
      inherited,
      uninherited,
    }
  }, defaultTiming);
}



function matchingTimingPoint<T extends BeatmapTimingPoint>(points: T[], time: number): T {
  const firstIndexLarger = points.findIndex(it => it.time > time);
  if (firstIndexLarger === -1) return points[points.length - 1];
  if (firstIndexLarger === 0) return points[0];
  return points[firstIndexLarger - 1];
}
