import { DifficultyHitObject } from "../Objects/osu!/HitObjects/DifficultyHitObject";
import { Spinner } from "../Objects/osu!/HitObjects/Spinner";

export abstract class Skill {
    protected SINGLE_SPACING_THRESHOLD: number = 125;
    protected STREAM_SPACING_THRESHOLD: number = 110;

    protected Previous: DifficultyHitObject[] = [];

    private currentStrain: number = 1;
    private currentSectionPeak: number = 1;
    private strainPeaks: number[] = [];

    protected abstract SkillMultiplier;
    protected abstract StrainDecayBase;

    saveCurrentPeak(): void {
        if (this.Previous.length > 0)
            this.strainPeaks.push(this.currentSectionPeak);
    };

    startNewSectionFrom(offset: number): void {
        if (this.Previous.length > 0)
            this.currentSectionPeak = this.currentStrain * this.strainDecay(offset - this.Previous[0].CurrentObject.StartTime);
    };

    process(currentObject: DifficultyHitObject): void {
        this.currentStrain *= this.strainDecay(currentObject.DeltaTime);
        if (!(currentObject.CurrentObject instanceof Spinner))
            this.currentStrain += this.strainValueOf(currentObject) * this.SkillMultiplier;

        this.currentSectionPeak = Math.max(this.currentStrain, this.currentSectionPeak);

        this.addToHistory(currentObject);
    };

    difficultyValue(): number {
        this.strainPeaks.sort((a, b) => {
            return b - a;
        });

        let difficulty: number = 0;
        let weight: number = 1;

        this.strainPeaks.forEach(strain => {
            difficulty += strain * weight;
            weight *= 0.9;
        });

        return difficulty;
    };

    protected abstract strainValueOf(currentObject: DifficultyHitObject): number;

    strainDecay(ms: number): number {
        return Math.pow(this.StrainDecayBase, ms / 1000);
    };

    addToHistory(currentObject: DifficultyHitObject): void {
        this.Previous.unshift(currentObject);
        if (this.Previous.length > 2)
            this.Previous.pop();
    };
};