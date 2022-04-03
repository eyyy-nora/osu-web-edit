import { ParsedHitObject, ParsedSlider, ParsedTimingPoint, ParsedEvent, ParsedOsuColors } from "../../parse/types";
import { 
  transformHitObjectType, transformHitSample, transformSliderType, 
  transformSliderPath, transformEdgeSounds, transformEdgeSets, transformBool 
} from "./transform";

export function processKVPairs(section: Object, isSpaced: boolean): string {
  if (isSpaced) return KeyValueProcessor(section, ": ");
  
  else return KeyValueProcessor(section, ":");
}

export function processHitObjects(hitObjects: ParsedHitObject[]): string {
  let serialHitObjects = "";

  if (hitObjects === undefined || hitObjects.length <= 0) return;

  hitObjects.forEach(hitObject => {
    if (hitObject === undefined) return;

    switch (hitObject.type) {
      case "circle": serialHitObjects += `${hitObject.x},${hitObject.y},${hitObject.time},${transformHitObjectType(hitObject)},${hitObject.hitSound}${transformHitSample(hitObject.hitSample)}\n`; break;
      
      case "slider": serialHitObjects += `${hitObject.x},${hitObject.y},${hitObject.time},${transformHitObjectType(hitObject)},${hitObject.hitSound},${transformSliderType(asSlider(hitObject).sliderType)}${transformSliderPath(asSlider(hitObject))},${asSlider(hitObject).slides},${asSlider(hitObject).length}${transformEdgeSounds(asSlider(hitObject).edgeSounds)}${transformEdgeSets(asSlider(hitObject).edgeSets)}${transformHitSample(asSlider(hitObject).hitSample)}\n`; break;

      case "spinner": serialHitObjects += `${hitObject.x},${hitObject.y},${hitObject.time},${transformHitObjectType(hitObject)},${hitObject.hitSound},${hitObject.end}${transformHitSample(hitObject.hitSample)}\n`; break;

      case "hold": serialHitObjects += `${hitObject.x},${hitObject.y},${hitObject.time},${transformHitObjectType(hitObject)},${hitObject.hitSound},${hitObject.end}${transformHitSample(hitObject.hitSample)}\n`; break;
    }
  })

  return serialHitObjects;
}

export function processTimingPoints(timingPoints: ParsedTimingPoint[]): string {
  let serialPoints = "";

  if (timingPoints === undefined || timingPoints.length <= 0) return;

  timingPoints.forEach(point => {
    if (point === undefined) return;

    serialPoints += 
      `${point.time},${point.beatLength},${point.meter},${point.sampleSet},${point.sampleIndex},${point.volume},${transformBool(point.inherited, true)},${transformBool(point.kiai, false)}\n`;
  })

  return serialPoints;
}

export function processVBEvents(events: ParsedEvent[]): string {
  let serialVideoBGEvents = "";

  if (events === undefined || events.length <= 0) return;

  events.forEach(event => {
    if (event === undefined) return;

    switch (event.type) {
      case "background": serialVideoBGEvents += `0,0,${event.filename},${event.x},${event.y} \n`; break;
      case "video": serialVideoBGEvents += `1,${event.time},${event.filename},${event.x},${event.y} \n`; break;
    }
  })

  return serialVideoBGEvents;
} 

export function processColours(colours: ParsedOsuColors): string {
  if (colours === undefined) return;

  return KeyValueProcessor(colours, " : ");
}

export function processBreakEvents(events: ParsedEvent[]): string {
  let breaks = "";

  if (events === undefined || events.length <= 0) return;

  events.forEach(event => {
    if (event === undefined) return;

    if (event.type === "break") breaks += `2,${event.time},${event.end} \n`;
  });

  return breaks;
}

function KeyValueProcessor(section: Object, appointedSeparator: string): string {
  return Object.entries(section).map(([key, value]) => `${key}${appointedSeparator}${value}`).join("\n");
}

function asSlider(hitObject: ParsedHitObject): ParsedSlider {
  return (hitObject as ParsedSlider);
}