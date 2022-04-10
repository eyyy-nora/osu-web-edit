import { ParsedHitObject, ParsedSlider } from "../../parse/types";

export const END_ROW = "\n";
export const END_SECTION = "\n\n";
export const EMPTY_STRING = "";

export function asSlider(hitObject: ParsedHitObject): ParsedSlider {
  return (hitObject as ParsedSlider);
}

export function optionalCoordinates(x: number, y: number): string {
  if (isNaN(x) && isNaN(y)) return EMPTY_STRING;
  else return `,${x},${y}`;
}

export function isEmpty(array: any[]): boolean {
  return (array === undefined || array.length <= 0);
}
