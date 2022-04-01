import { Skill } from "./Skill";
import { DifficultyHitObject } from "../Objects/osu!/HitObjects/DifficultyHitObject";

export class Aim extends Skill {
    private angle_bonus_begin: number = Math.PI / 3;
    private timing_threshold: number = 107;

    protected SkillMultiplier: number = 26.25;
    protected StrainDecayBase: number = 0.15;

    strainValueOf(currentObject: DifficultyHitObject): number {
        let result: number = 0;
        const scale: number = 90;

        function applyDiminishingExp(val: number): number {
            return Math.pow(val, 0.99);
        };

        if (this.Previous.length > 0) {
            if (currentObject.Angle !== null && currentObject.Angle !== undefined && currentObject.Angle > 0 && currentObject.Angle > this.angle_bonus_begin) {
                let angleBonus: number = Math.sqrt(
                    Math.max(this.Previous[0].JumpDistance - scale, 0) *
                    Math.pow(Math.sin(currentObject.Angle - this.angle_bonus_begin), 2) *
                    Math.max(currentObject.JumpDistance - scale, 0)
                );
                result = 1.5 * applyDiminishingExp(Math.max(0, angleBonus)) / Math.max(this.timing_threshold, this.Previous[0].StrainTime);
            }
        }

        const jumpDistanceExp: number = applyDiminishingExp(currentObject.JumpDistance);
        const travelDistanceExp: number = applyDiminishingExp(currentObject.TravelDistance);

        let returnValue = Math.max(
            result + (jumpDistanceExp + travelDistanceExp + Math.sqrt(travelDistanceExp * jumpDistanceExp)) / Math.max(currentObject.StrainTime, this.timing_threshold),
            (Math.sqrt(travelDistanceExp * jumpDistanceExp) + jumpDistanceExp + travelDistanceExp) / currentObject.StrainTime);
        return returnValue
    };
};