import { ParsedBeatmap } from "../parse/types";
import { SkillAccumulator } from "./types";



export function createSpeedAccumulator(beatmap: ParsedBeatmap): SkillAccumulator {

  const init: SkillAccumulator["init"] = (mods) => {
    // todo: code
  };

  const processSection: SkillAccumulator["processSection"] = (section) => {
    // todo: code
  };

  const accumulate: SkillAccumulator["accumulate"] = () => {
    // todo: code
    return 1;
  };

  return { processSection, accumulate, init };
}
