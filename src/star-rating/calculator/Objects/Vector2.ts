export class Vector2 {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    };

    add (vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    };

    subtract (vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    };

    scale (scaleFactor: number): Vector2 {
        return new Vector2(this.x * scaleFactor, this.y * scaleFactor);
    };

    divide (divideFactor: number): Vector2 {
        if (divideFactor === 0)
            throw new Error("Attempt to divide vector by 0");
        return new Vector2(this.x / divideFactor, this.y / divideFactor);
    };

    dot (vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    };

    length (): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    lengthSquared (): number {
        return Math.pow(this.length(), 2);
    };

    distance (vector: Vector2): number {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
        const dist = x * x + y * y;
        return Math.sqrt(dist);
    };

    clone (): Vector2 {
        return new Vector2(this.x, this.y);
    };

    normalize (): void {
        const length: number = this.length();
        this.x /= length;
        this.y /= length;
    };

    almostEquals (vec2: Vector2, acceptableDifference: number): boolean {
        function checkNumbers(value1: number, value2: number): boolean {
            return Math.abs(value1 - value2) <= acceptableDifference;
        };

        return checkNumbers(this.x, vec2.x) && checkNumbers(this.y, vec2.y);
    };
};