import { DifficultyHitObject } from "./Objects/osu!/HitObjects/DifficultyHitObject";
import { Aim } from "./Skills/Aim";
import { Speed } from "./Skills/Speed";

export interface SRCalculatorResponse {
    aim: number;
    speed: number;
    total: number;
};

class StarRatingCalculator {
    private hitObjects: DifficultyHitObject[];
    private section_length: number = 400;
    private difficulty_multiplier: number = 0.0675;

    calculate(hitObjects: DifficultyHitObject[], timeRate: number): SRCalculatorResponse {
        this.hitObjects = hitObjects;
        let aimSkill = new Aim();
        let speedSkill = new Speed();

        const sectionLength = this.section_length * timeRate;

        let currentSectionEnd: number = Math.ceil((this.hitObjects[0]?.StartTime || 0) / sectionLength) * sectionLength;

        this.hitObjects.forEach(h => {
            // console.log("JumpDistance:", h.JumpDistance, "- TravelDistance:", h.TravelDistance, "- DeltaTime:", h.DeltaTime, "- StrainTime:", h.StrainTime, "- Angle:", h.Angle);
            while (h.CurrentObject.StartTime > currentSectionEnd) {
                aimSkill.saveCurrentPeak();
                aimSkill.startNewSectionFrom(currentSectionEnd);

                speedSkill.saveCurrentPeak();
                speedSkill.startNewSectionFrom(currentSectionEnd);

                currentSectionEnd += sectionLength;
            }

            aimSkill.process(h);
            speedSkill.process(h);
        });

        aimSkill.saveCurrentPeak();
        speedSkill.saveCurrentPeak();

        const aimRating: number = Math.sqrt(aimSkill.difficultyValue()) * this.difficulty_multiplier;
        const speedRating: number = Math.sqrt(speedSkill.difficultyValue()) * this.difficulty_multiplier;
        const starRating: number = aimRating + speedRating + Math.abs(aimRating - speedRating) / 2;
        return { aim: aimRating, speed: speedRating, total: starRating };
    }
};

export default StarRatingCalculator;