import { HitObject } from "../HitObject";
import { Vector2 } from "../../../../../../util/Vector2";

export class RepeatPoint extends HitObject {
    RepeatIndex: number;
    SpanDuration: number;

    constructor(pos: Vector2, startTime: number, repeatIndex: number, spanDuration: number, radius?: number) {
        super(pos, startTime, radius);
        this.RepeatIndex = repeatIndex;
        this.SpanDuration = spanDuration;
    };
};
