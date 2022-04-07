import { HitObject } from "./HitObject";
import { Vector2 } from "../../../../../util/Vector2";

/**
 * Class for spinners
 */
export class Spinner extends HitObject {
    EndTime: number;

    /**
     * 
     * @param startTime The start time of the spinner
     * @param endTime The end time of the spinner
     */
    constructor(pos: Vector2, startTime: number, endTime: number) {
        super(pos, startTime);
        this.EndTime = endTime;
    };
};
