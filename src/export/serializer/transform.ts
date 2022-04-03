import { ParsedHitObject, ParsedHitSamples, ParsedSlider } from "../../parse/types";
import { BIT2, BIT0, BIT1, BIT3, BIT7 } from "../../util/numbers";

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
  
  if (edgeSounds === undefined || edgeSounds.length <= 0) return "";

  for (let i = 0; i < edgeSounds.length; i++) {
    let sound = edgeSounds[i];

    if (!isLastLoopIteration(i, edgeSounds.length)) serializedEdgeSounds += `${sound}|`
    else serializedEdgeSounds += `${sound}`;
  }

  return serializedEdgeSounds;
}

export function transformEdgeSets(edgeSets: ParsedSlider["edgeSets"]): string {
  let serializedEdgeSets = ","

  if (edgeSets === undefined || edgeSets.length <= 0) return "";

  for (let i = 0; i < edgeSets.length; i++) {
    let set = edgeSets[i];

    if (!isLastLoopIteration(i, edgeSets.length)) serializedEdgeSets += `${set}|`
    else serializedEdgeSets += `${set}`;
  }

  return serializedEdgeSets;
}

export function transformSliderPath(slider: ParsedSlider): string {
  let path = "";

  if (slider.pathSegments === undefined || slider.pathSegments.length <= 0) 
    throw new Error(`Serialization Error: Invalid object, slider has no path`);

  slider.pathSegments.forEach(segment => {
    if (segment === undefined) return;

    if (segment.anchor) path += `|${segment.x}:${segment.y}|${segment.x}:${segment.y}`;

    else path += `|${segment.x}:${segment.y}`;
  });

  return path;
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

export function transformHitSample(hitSample: ParsedHitSamples): string {
  if (hitSample.additionalSet === undefined) return "";
  if (hitSample.index === undefined) return "";
  if (hitSample.volume === undefined) return "";
  if (hitSample.filename === undefined) return "";

  return `,${hitSample.normalSet}:${hitSample.additionalSet}:${hitSample.index}:${hitSample.volume}:${hitSample.filename}`;
}

export function transformBool(bool: boolean, isInheritedCheck: boolean): number {
  if (isInheritedCheck) return !(bool === true) ? 1 : 0;

  else return (bool === true) ? 1 : 0;
}



function isLastLoopIteration(iterator: number, length: number): boolean {
  return iterator === (length - 1)
}