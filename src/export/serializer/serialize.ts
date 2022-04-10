import {
  ParsedHitObject, ParsedSpinner, ParsedHold,
  ParsedHitCircle, ParsedSlider, ParsedTimingPoint,
  ParsedEvent, ParsedBackgroundEvent, ParsedVideoEvent,
  ParsedBreakEvent, ParsedHitSamples
} from "../../parse/types";

import {
  transformBool,
  transformEdgeSets, transformEdgeSounds, transformHitObjectType,
  transformHitSample, transformSliderPath, transformSliderType
} from "./transform";

import { asSlider, END_ROW, optionalCoordinates } from "./util";

function serializeHitObject(hitObject: ParsedHitObject): string {
  return (
    `${hitObject.x},${hitObject.y},${hitObject.time},${transformHitObjectType(hitObject)},${hitObject.hitSound}`
  );
}

function serializeEvent(eventType: string, event: ParsedEvent): string {
  return (
    `${eventType},${event.time ?? '0'},`
  );
}


export function serializeCircle(circle: ParsedHitCircle): string {
  return (
    `${serializeHitObject(circle)}${transformHitSample(circle.hitSample)}` + END_ROW
  );
}

export function serializeSlider(slider: ParsedSlider): string {
  return (
    `${serializeHitObject(slider)},${transformSliderType(asSlider(slider).sliderType)}${transformSliderPath(asSlider(slider))},${asSlider(slider).slides},${asSlider(slider).length}${transformEdgeSounds(asSlider(slider).edgeSounds)}${transformEdgeSets(asSlider(slider).edgeSets)}${transformHitSample(asSlider(slider).hitSample)}` + END_ROW
  );
}

export function serializeHoldOrSpinner(hitObject: ParsedSpinner | ParsedHold): string {
  return (
    `${serializeHitObject(hitObject)},${hitObject.end}${transformHitSample(hitObject.hitSample)}` + END_ROW
  );
}

export function serializeTimingPoint(point: ParsedTimingPoint): string {
  return (
    `${point.time},${point.beatLength},${point.meter},${point.sampleSet},${point.sampleIndex},${point.volume},${transformBool(point.inherited, true)},${transformBool(point.kiai, false)}` + END_ROW
  );
}

export function serializeBackground(event: ParsedBackgroundEvent): string {
  return (
    `${serializeEvent('0', event)}${event.filename},${event.x},${event.y}` + END_ROW
  );
}

export function serializeVideo(event: ParsedVideoEvent): string {
  return (
    `${serializeEvent('1', event)}${event.filename}${optionalCoordinates(event.x, event.y)}` + END_ROW
  );
}

export function serializeBreak(event: ParsedBreakEvent): string {
  return (
    `${serializeEvent('2', event)}${event.end}` + END_ROW
  );
}

export function serializeHitSamples(hitSamples: ParsedHitSamples): string {
  return (
    `,${hitSamples.normalSet}:${hitSamples.additionalSet}:${hitSamples.index}:${hitSamples.volume}:${hitSamples.filename}`
  );
}

export function serializePathSegment(x: number, y: number): string {
  return (
    `|${x}:${y}`
  );
}
