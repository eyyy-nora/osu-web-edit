import { HitObject } from "./HitObject";
import { Vector2 } from "../../Vector2";

/**
 * Class for hit circles
 */
export class HitCircle extends HitObject {
    /**
     * 
     * @param pos The raw position of the hit circle (as listed in the .osu file)
     * @param startTime The hit time of the hit circle in ms from start
     * @param radius The radius of the hit circle
     */
    constructor(pos: Vector2, startTime: number, radius?: number) {
        super(pos, startTime, radius);
    };
};