import { ParsedHitObject, ParsedTimingPoint, ParsedEvent } from "../../parse/types";
import { EMPTY_STRING, isEmpty } from "./util";

import {
  serializeBackground,
  serializeBreak,
  serializeCircle, serializeHoldOrSpinner,
  serializeSlider, serializeTimingPoint, serializeVideo
} from "./serialize";

export function processKeyValuePairs(section: Object, appointedSeparator: string): string {
  if (section === undefined) return EMPTY_STRING;

  return Object.entries(section).map(([key, value]) => `${key}${appointedSeparator}${value}`).join("\n");
}

export function processHitObjects(hitObjects: ParsedHitObject[]): string {
  if (isEmpty(hitObjects)) return EMPTY_STRING;

  let hitObjectsAsString = "";

  for (const hitObject of hitObjects) {
    if (hitObject === undefined) return;

    switch (hitObject.type) {
      case "circle": hitObjectsAsString += serializeCircle(hitObject); break;

      case "slider": hitObjectsAsString += serializeSlider(hitObject); break;

      case "spinner": case "hold": hitObjectsAsString += serializeHoldOrSpinner(hitObject); break;
    }
  }

  return hitObjectsAsString;
}

export function processTimingPoints(timingPoints: ParsedTimingPoint[]): string {
  if (isEmpty(timingPoints)) return EMPTY_STRING;

  let timingPointsAsString = "";

  for (const point of timingPoints) {
    if (point === undefined) return;

    timingPointsAsString += serializeTimingPoint(point);
  }

  return timingPointsAsString;
}

export function processVideoAndBackgroundEvents(events: ParsedEvent[]): string {
  if (isEmpty(events)) return EMPTY_STRING;

  let serialVideoBGEvents = "";

  events.forEach(event => {
    if (event === undefined) return;

    switch (event.type) {
      case "background": serialVideoBGEvents += serializeBackground(event); break;
      case "video": serialVideoBGEvents += serializeVideo(event); break;
    }
  })

  return serialVideoBGEvents;
}

export function processBreakEvents(events: ParsedEvent[]): string {
  if (isEmpty(events)) return EMPTY_STRING;

  let breaks = "";

  events.forEach(event => {
    if (event === undefined) return;

    if (event.type === "break") breaks += serializeBreak(event);
  });

  return breaks;
}
