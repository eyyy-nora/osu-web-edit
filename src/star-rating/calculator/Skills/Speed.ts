import { Skill } from "./Skill";
import { DifficultyHitObject } from "../Objects/osu!/HitObjects/DifficultyHitObject";

export class Speed extends Skill {
    private angle_bonus_begin: number = 5 * Math.PI / 6;
    private pi_over_4: number = Math.PI / 4;
    private pi_over_2: number = Math.PI / 2;

    protected SkillMultiplier: number = 1400;
    protected StrainDecayBase: number = 0.3;

    private min_speed_bonus: number = 75;
    private max_speed_bonus: number = 45;
    private speed_balancing_factor: number = 40;

    strainValueOf(currentObject: DifficultyHitObject): number {
        const distance: number = Math.min(this.SINGLE_SPACING_THRESHOLD, currentObject.TravelDistance + currentObject.JumpDistance);
        const deltaTime: number = Math.max(this.max_speed_bonus, currentObject.DeltaTime);

        let speedBonus: number = 1.0;
        if (deltaTime < this.min_speed_bonus)
            speedBonus = 1 + Math.pow((this.min_speed_bonus - deltaTime) / this.speed_balancing_factor, 2);

        let angleBonus: number = 1.0;
        if (currentObject.Angle !== null && currentObject.Angle !== undefined && currentObject.Angle > 0 && currentObject.Angle < this.angle_bonus_begin) {
            angleBonus = 1 + Math.pow(Math.sin(1.5 * (this.angle_bonus_begin - currentObject.Angle)), 2) / 3.57;
            if (currentObject.Angle < this.pi_over_2) {
                angleBonus = 1.28;
                if (distance < 90 && currentObject.Angle < this.pi_over_4)
                    angleBonus += (1 - angleBonus) * Math.min((90 - distance) / 10, 1);
                else if (distance < 90)
                    angleBonus += (1 - angleBonus) * Math.min((90 - distance) / 10, 1) * Math.sin((this.pi_over_2 - currentObject.Angle) / this.pi_over_4);
            }
        }

        let returnValue = (1 + (speedBonus - 1) * 0.75) * angleBonus * (0.95 + speedBonus * Math.pow(distance / this.SINGLE_SPACING_THRESHOLD, 3.5)) / currentObject.StrainTime;
        return returnValue;
    };
};