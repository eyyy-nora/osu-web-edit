import BeatmapParser from "./BeatmapParser";
import DifficultyHitObjectCreator from "./DifficultyHitObjectCreator";
import StarRatingCalculator, { SRCalculatorResponse } from "./StarRatingCalculator";

const beatmapParser = new BeatmapParser();
const difficultyHitObjectCreator = new DifficultyHitObjectCreator();
const starRatingCalculator = new StarRatingCalculator();
let Beatmap = null;

export function calculateStarRating(dotOsuFile: string, mods?: string[], allCombinations?: boolean, returnAllDifficultyValues: boolean = false): object {
    if (dotOsuFile === null)
        throw new Error("Difficulty Calculation Failed: Provided file is empty");

    mods = parseMods(mods);
    let output = { };
    if (!allCombinations) {
        const label = mods.length > 0 ? mods.join('') : "nomod";
        const response = calculateNextModCombination(dotOsuFile, mods, true);
        output[label] = returnAllDifficultyValues ? response : response.total;
        return output;
    }
    else {
        const allModCombinations = getAllModCombinations();
        allModCombinations.forEach(combi => {
            const label = combi.mods.length > 0 ? combi.mods.join('') : "nomod";
            const response = calculateNextModCombination(dotOsuFile, combi.mods, combi.reParse);
            output[label] = returnAllDifficultyValues ? response : response.total;
        });
        return output;
    }
}

function calculateNextModCombination(dotOsuFile: string, mods: string[], reParse: boolean): SRCalculatorResponse {
    if (reParse)
        Beatmap = beatmapParser.parseBeatmap(dotOsuFile, mods);

    const timeRate = getTimeRate(mods);
    const difficultyHitObjects = difficultyHitObjectCreator.convertToDifficultyHitObjects(Beatmap.HitObjects, timeRate);
    return starRatingCalculator.calculate(difficultyHitObjects, timeRate);
};

function parseMods(mods: string[]): string[] {
    if (mods === undefined)
        return [];
    return mods;
};

function getTimeRate(mods: string[]): number {
    if (mods.includes("DT"))
        return 1.5;
    if (mods.includes("HT"))
        return 0.75;
    return 1;
};

function getAllModCombinations(): Array<{ mods: string[], reParse: boolean }> {
    return [
        { mods: [], reParse: true },
        { mods: ["DT"], reParse: false },
        { mods: ["HT"], reParse: false },
        { mods: ["HR"], reParse: true },
        { mods: ["HR", "DT"], reParse: false },
        { mods: ["HR", "HT"], reParse: false },
        { mods: ["EZ"], reParse: true },
        { mods: ["EZ", "DT"], reParse: false },
        { mods: ["EZ", "HT"], reParse: false }
    ];
};