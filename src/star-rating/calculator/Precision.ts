import { Vector2 } from "../../util/Vector2";

export abstract class Precision {
    public static FLOAT_EPSILON: number = 1e-3;

    public static almostEqualsNumber(value1: number, value2: number, acceptableDifference: number = this.FLOAT_EPSILON): boolean {
        return Math.abs(value1 - value2) <= acceptableDifference;
    };

    public static almostEqualsVector(vec1: Vector2, vec2: Vector2, acceptableDifference: number = this.FLOAT_EPSILON): boolean {
        return this.almostEqualsNumber(vec1.x, vec2.x, acceptableDifference) && this.almostEqualsNumber(vec1.y, vec2.y, acceptableDifference);
    };
};
