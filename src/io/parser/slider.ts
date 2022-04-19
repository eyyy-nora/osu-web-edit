import { BeatmapSlider, BeatmapSliderPoint } from "../types";
import { sliderTypes } from "../constants";


export function parseOsuSlider(
  curveTypeAndPoints: string,
  slides: string,
  length: string,
  edgeSounds: string,
  edgeSets: string,
): Partial<BeatmapSlider> {
  const [prefix, ...points] = curveTypeAndPoints.split("|");
  const sliderType = sliderTypes[prefix];
  const path = parseOsuSliderPoints(points);
  return {
    type: "slider",
    sliderType,
    path,
    slides: +slides,
    length: +length,
    edgeSounds: edgeSounds?.split("|").map(sound => +sound) ?? [],
    edgeSets: (edgeSets?.split("|") ?? []).map(it => it.split(":")) as any[],
  } as const;
}

export function parseOsuSliderPoints(points: string[]): BeatmapSliderPoint[] {
  const pathSegments: BeatmapSliderPoint[] = [];
  let last: [number, number] | undefined = undefined;
  for (const [x, y] of points.map(point => point.split(":").map(value => +value)) as [number, number][]) {
    if (last && last[0] === x && last[1] === y) pathSegments[pathSegments.length - 1].anchor = true;
    else {
      pathSegments.push({ x, y, anchor: false });
      last = [x, y];
    }
  }
  return pathSegments;
}
