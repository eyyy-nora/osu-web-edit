import { derived, Readable } from "src/context/stores";
import {
  Beatmap,
  BeatmapInheritedTimingPoint,
  BeatmapTimingPoint,
  BeatmapUninheritedTimingPoint
} from "src/io";


export interface Timing {
  beatLength: number;
  offset: number;
  meter: number;
  inherited?: BeatmapInheritedTimingPoint;
  uninherited?: BeatmapUninheritedTimingPoint;
  scale: number;
}

const scaleLevels = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];

const defaultTiming: Timing = {
  beatLength: 200,
  offset: 0,
  meter: 4,
  scale: 4,
}


export function createTimingStore(
  $beatmap: Readable<Beatmap>,
  $time: Readable<number>,
  $scale: Readable<number>,
) {
  return derived([
    $beatmap,
    $time,
    $scale,
  ], ([beatmap, time, scale]): Timing => {
    const timingPoints = beatmap?.timingPoints;
    if (!timingPoints || !timingPoints.length) return {
      ...defaultTiming,
      scale: scaleLevels[scale],
    };

    const inherited = matchingTimingPoint(timingPoints.filter(it => it.inherited), time) as BeatmapInheritedTimingPoint;
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
      scale: scaleLevels[scale],
    };
  }, defaultTiming);
}



function matchingTimingPoint<T extends BeatmapTimingPoint>(points: T[], time: number): T {
  const firstIndexLarger = points.findIndex(it => it.time > time);
  if (firstIndexLarger === -1) return points[points.length - 1];
  if (firstIndexLarger === 0) return points[0];
  return points[firstIndexLarger - 1];
}
