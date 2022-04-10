import { ParsedHitObject, ParsedHitSamples, ParsedSlider } from "../../parse/types";
import { BIT2, BIT0, BIT1, BIT3, BIT7 } from "../../util/numbers";
import { serializeHitSamples, serializePathSegment } from "./serialize";
import { EMPTY_STRING, isEmpty } from "./util";

export function transformSliderType(sliderType: ParsedSlider["sliderType"]): string {
  switch(sliderType) {
    case "bezier": return "B";
    case "catmull": return "C";
    case "circle": return "P";
    case "linear": return "L";
  }
}

export function transformEdgeSounds(edgeSounds: ParsedSlider["edgeSounds"]): string {
  let serializedEdgeSounds = ",";

  if (isEmpty(edgeSounds)) return EMPTY_STRING;

  for (let i = 0; i < edgeSounds.length; i++) {
    let sound = edgeSounds[i];

    if (!isLastLoopIteration(i, edgeSounds.length)) serializedEdgeSounds += `${sound}|`
    else serializedEdgeSounds += `${sound}`;
  }

  return serializedEdgeSounds;
}

export function transformEdgeSets(edgeSets: ParsedSlider["edgeSets"]): string {
  let serializedEdgeSets = ","

  if (isEmpty(edgeSets)) return EMPTY_STRING;

  for (let i = 0; i < edgeSets.length; i++) {
    let set = edgeSets[i];

    if (!isLastLoopIteration(i, edgeSets.length)) serializedEdgeSets += `${set}|`
    else serializedEdgeSets += `${set}`;
  }

  return serializedEdgeSets;
}

export function transformSliderPath(slider: ParsedSlider): string {
  let sliderPath = "";

  if (isEmpty(slider.pathSegments))
    throw new Error(`Serialization Error: Invalid object, slider has no path`);

  for (const segment of slider.pathSegments) {
    if (segment === undefined) return;

    let { x, y } = segment;

    if (segment.anchor) sliderPath += serializePathSegment(x, y) + serializePathSegment(x, y);
    else sliderPath += serializePathSegment(x, y);
  }

  return sliderPath;
}

export function transformHitObjectType(hitObject: ParsedHitObject): string {
  let type_ = 0;

  if (hitObject.newCombo) type_ |= BIT2 | (hitObject.skipColors << 4);

  switch (hitObject.type) {
    case "circle": type_ |= BIT0; break;
    case "slider": type_ |= BIT1; break;
    case "spinner": type_ |= BIT3; break;
    case "hold": type_ |= BIT7; break;
  }

  return type_.toString();
}

export function transformHitSample(hitSamples: ParsedHitSamples): string {
  for (const [key, value] of Object.entries(hitSamples)) {
    if (value === undefined) return EMPTY_STRING;
  }

  return serializeHitSamples(hitSamples);
}

export function transformBool(bool: boolean, isInheritedCheck: boolean): number {
  if (isInheritedCheck) return !(bool === true) ? 1 : 0;

  return (bool === true) ? 1 : 0;
}


function isLastLoopIteration(iterator: number, length: number): boolean {
  return iterator === (length - 1)
}
