import { HitObject } from "../HitObject";
import { Vector2 } from "../../../Vector2";

export class SliderTick extends HitObject {
    SpanIndex: number;
    SpanStartTime: number;

    constructor(pos: Vector2, startTime: number, spanIndex: number, spanStartTime: number, radius?: number) {
        super(pos, startTime, radius);
        this.SpanIndex = spanIndex;
        this.SpanStartTime = spanStartTime;
    };
};