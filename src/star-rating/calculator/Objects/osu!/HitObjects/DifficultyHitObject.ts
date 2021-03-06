import { HitObject } from "./HitObject";

/**
 * HitObject with additional difficulty properties required to calculate the star rating
 */
export class DifficultyHitObject extends HitObject {
    TravelDistance: number;
    JumpDistance: number;
    Angle: number;
    DeltaTime: number;
    StrainTime: number;

    CurrentObject: HitObject;
    LastObject: HitObject;
    LastLastObject: HitObject;

    /**
     * 
     * @param currentObject HitObject to create a DifficultyHitObject from
     * @param lastObject HitObject before the current HitObject
     * @param lastLastObject HitObject before the lastObject
     * @param travelDistance The calculated Travel Distance for this HitObject
     * @param jumpDistance The calculated Jump Distance for this HitObject
     * @param angle The calculated Angle for this HitObject
     * @param deltaTime The calculated Deltatime for this HitObject
     * @param strainTime The calculated Straintime for this hitObject
     */
    constructor(currentObject: HitObject, lastObject: HitObject, lastLastObject: HitObject, travelDistance: number, jumpDistance: number, angle: number, deltaTime: number, strainTime: number) {
        super(currentObject.Position, currentObject.StartTime, currentObject.Radius);
        this.TravelDistance = travelDistance;
        this.JumpDistance = jumpDistance;
        this.Angle = angle;
        this.DeltaTime = deltaTime;
        this.StrainTime = strainTime;

        this.CurrentObject = currentObject;
        this.LastObject = lastObject;
        this.LastLastObject = lastLastObject;
    };
};