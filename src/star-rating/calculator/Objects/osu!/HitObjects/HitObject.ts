import { Vector2 } from "../../Vector2";

/**
 * Base class for all osu! hit objects
 */
export abstract class HitObject {
    Position: Vector2;
    StartTime: number;
    Radius: number;
    StackHeight: number;
    StackedPosition: Vector2;

    constructor(pos: Vector2, startTime: number, radius?: number) {
        this.Position = pos;
        this.StartTime = startTime;
        this.Radius = radius;
    };

    calculateStackedPosition(scale: number): void {
        const coordinate: number = this.StackHeight * scale * -6.4;
        const stackOffset: Vector2 = new Vector2(coordinate, coordinate);
        if (this.Position !== undefined)
            this.StackedPosition = this.Position.add(stackOffset);        
    };
};