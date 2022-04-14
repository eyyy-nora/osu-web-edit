import { ParsedBeatmap, ParsedHitObject } from "../parse/types";
import { createAimAccumulator } from "./aim";
import { createSpeedAccumulator } from "./speed";
import { BeatmapMod, SkillAccumulatorMap, SkillResultMap, Skills } from "./types";


export function calculateBeatmapRating<Accumulators extends SkillAccumulatorMap>(
  beatmap: ParsedBeatmap,
  accumulators: Accumulators,
  mods: BeatmapMod[] = [],
): SkillResultMap<Skills<Accumulators>> {
  const sectionBaseLength = 400, difficultyMultiplier = 0.0675;
  const sectionLength = sectionBaseLength * (mods.includes("DT") ? 1.5 : mods.includes("HT") ? .75 : 1);

  if (!("aim" in accumulators)) accumulators.aim = createAimAccumulator(beatmap);
  if (!("speed" in accumulators)) accumulators.aim = createSpeedAccumulator(beatmap);

  for (const accumulator of Object.values(accumulators))
    accumulator.init?.(mods);

  for (const section of hitObjectSections(beatmap.HitObjects, sectionLength))
    for (const accumulator of Object.values(accumulators))
      accumulator.processSection(section);

  const results: SkillResultMap<Skills<Accumulators>> =
    Object.fromEntries(Object.entries(accumulators).map(([key, value]) => {
      return [key, Math.sqrt(value.accumulate()) * difficultyMultiplier];
    })) as never;

  results.stars = results.aim + results.speed + Math.abs(results.aim - results.speed) / 2;
  return results;
}

export function startTime(objects: ParsedHitObject[]): number {
  return objects?.[0].time ?? 0;
}

export function sectionBounds(time: number, sectionLength: number): [number, number] {
  const start = Math.floor(time / sectionLength);
  return [start * sectionLength, (start + 1) * sectionLength];
}

export function* hitObjectSections(objects: ParsedHitObject[], sectionLength: number) {
  let [, sectionEnd] = sectionBounds(startTime(objects), sectionLength);
  let sectionStartIndex = 0;

  for (let i = 0; i < objects.length; ++i)
    if (objects[i].time > sectionEnd) {
      yield objects.slice(sectionStartIndex, i - 1);
      sectionStartIndex = i;
      [, sectionEnd] = sectionBounds(objects[i].time, sectionLength);
    }

  yield objects.slice(sectionStartIndex, objects.length);
}
