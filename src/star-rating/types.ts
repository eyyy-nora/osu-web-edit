import { ParsedHitObject } from "../parse/types";

export interface SkillAccumulator {
  init?(mods: BeatmapMod[]): void;
  processSection(section: ParsedHitObject[]): void;
  accumulate(): number;
}

export type SkillResultMap<Skills extends string> = { [Key in Skills]: number; } & { stars: number; aim: number; speed: number };
export type SkillAccumulatorMap = { [Key in string]: SkillAccumulator; } & { aim?: SkillAccumulator; speed?: SkillAccumulator };
export type Skills<Accumulators extends SkillAccumulatorMap> = keyof Accumulators & string | "stars" | "aim" | "speed";

export type BeatmapMod = "HT" | "DT" | "HR" | "EZ" | "HD" | "FL" | "SO" | "AP" | "RX";
