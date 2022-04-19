import { BeatmapColorSection } from "../../types";

export function serializeColorSection(colors: BeatmapColorSection): string {
  const lines: string[] = ["[Colours]"];
  for (let i = 0; i < colors.colors.length; ++i)
    lines.push(`Combo${i}: ${colors.colors[i].join(",")}`);
  if (colors.backgroundColor)
    lines.push(`BackgroundColor: ${colors.backgroundColor.join(",")}`);
  if (colors.sliderBorder)
    lines.push(`SliderBorder: ${colors.sliderBorder.join(",")}`);
  if (colors.sliderTrackOverride)
    lines.push(`SliderTrackOverride: ${colors.sliderTrackOverride.join(",")}`);
  return lines.join("\n");
}
