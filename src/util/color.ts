import { clamp } from "./numbers";

export type Color = [r: number, g: number, b: number]

export function colorToNumber([r, g, b]: Color): number {
  return r << 16 | g << 8 | b;
}

export function numberToColor(color: number): Color {
  return [color >> 16, (color >> 8) & 0xFF, color & 0xFF];
}

export function lighten(color: Color, value: number): Color {
  return color.map(channel => clamp(channel * (value + 1), 0, 255) | 0) as Color;
}

export function darken(color: Color, value: number): Color {
  return color.map(channel => clamp(channel * (1 - value), 0, 255) | 0) as Color;
}
