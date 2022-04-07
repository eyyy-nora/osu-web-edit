import { PathType } from "./Objects/osu!/PathType";
import PathApproximator from "./PathApproximator";
import { Vector2 } from "../../util/Vector2";
import { Precision } from "./Precision";

export class SliderPath {
    pathType: PathType;
    controlPoints: Vector2[];
    expectedDistance: number;
    isInitialised: boolean = false;

    calculatedPath: Vector2[];
    cumulativeLength: number[];
    pathApproximator: PathApproximator = new PathApproximator();

    constructor(pathType: PathType, controlPoints: Vector2[], expectedDistance: number) {
        this.pathType = pathType;
        this.controlPoints = controlPoints;
        this.expectedDistance = expectedDistance;

        this.ensureInitialised();
    };

    ensureInitialised(): void {
        if (this.isInitialised)
            return;

        this.isInitialised = true;
        this.controlPoints = this.controlPoints !== null ? this.controlPoints : [];
        this.calculatedPath = [];
        this.cumulativeLength = [];

        this.calculatePath();
        this.calculateCumulativeLength();
    };

    calculatePath(): void {
        this.calculatedPath = [];

        let start = 0;
        let end = 0;

        for (let i = 0; i < this.controlPoints.length; i++) {
            end++;
            //Different class instances are always different, so check the x and y values for equality instead
            if (i === this.controlPoints.length - 1 || (this.controlPoints[i].x === this.controlPoints[i + 1].x && this.controlPoints[i].y === this.controlPoints[i + 1].y)) {
                let cpSpan = this.controlPoints.slice(start, end);
                this.calculateSubPath(cpSpan).forEach(t => {
                    if (this.calculatedPath.length === 0 || this.calculatedPath[this.calculatedPath.length - 1].x !== t.x || this.calculatedPath[this.calculatedPath.length - 1].y !== t.y) {
                        this.calculatedPath.push(new Vector2(t.x, t.y));
                    }
                });
                start = end;
            }
        }
    };

    calculateSubPath(subControlPoints: Vector2[]): Vector2[] {
        switch (this.pathType) {
            case PathType.Linear:
                return this.pathApproximator.approximateLinear(subControlPoints);
            case PathType.PerfectCurve:
                if (this.controlPoints.length !== 3 || subControlPoints.length !== 3)
                    break;
                const subPath = this.pathApproximator.approximateCircularArc(subControlPoints);
                if (subPath.length === 0)
                    break;
                return subPath;
            case PathType.Catmull:
                return this.pathApproximator.approximateCatmull(subControlPoints);
        }

        return this.pathApproximator.approximateBezier(subControlPoints);
    };

    calculateCumulativeLength(): void {
        let l = 0;

        this.cumulativeLength = [];
        this.cumulativeLength.push(l);

        for (let i = 0; i < this.calculatedPath.length - 1; i++) {
            let diff = this.calculatedPath[i + 1].subtract(this.calculatedPath[i]);
            let d = diff.length();

            if (this.expectedDistance !== null && this.expectedDistance !== undefined && this.expectedDistance - l < d) {
                this.calculatedPath[i + 1] = this.calculatedPath[i].add(diff.scale((this.expectedDistance - l) / d));
                this.calculatedPath.splice(i + 2, this.calculatedPath.length - 2 - i);

                l = this.expectedDistance;
                this.cumulativeLength.push(l);
                break;
            }

            l += d;
            this.cumulativeLength.push(l);
        }

        if (this.expectedDistance !== undefined && this.expectedDistance !== null && l < this.expectedDistance && this.calculatedPath.length > 1) {
            let diff = this.calculatedPath[this.calculatedPath.length - 1].subtract(this.calculatedPath[this.calculatedPath.length - 2]);
            let d = diff.length();

            if (d <= 0)
                return;

            this.calculatedPath[this.calculatedPath.length - 1].add(diff.scale((this.expectedDistance - l) / d));
            this.cumulativeLength[this.calculatedPath.length - 1] = this.expectedDistance;
        }
    };

    PositionAt(progress: number): Vector2 {
        this.ensureInitialised();

        const d: number = this.progressToDistance(progress);
        return this.interpolateVertices(this.indexOfDistance(d), d);
    };

    private progressToDistance(progress: number): number {
        return Math.min(Math.max(progress, 0), 1) * this.expectedDistance;
    };

    private interpolateVertices(i: number, d: number): Vector2 {
        if (this.calculatedPath.length === 0)
            return new Vector2(0, 0);

        if (i <= 0)
            return this.calculatedPath[0];
        if (i >= this.calculatedPath.length)
            return this.calculatedPath[this.calculatedPath.length - 1];

        const p0: Vector2 = this.calculatedPath[i - 1];
        const p1: Vector2 = this.calculatedPath[i];

        const d0: number = this.cumulativeLength[i - 1];
        const d1: number = this.cumulativeLength[i];

        if (Precision.almostEqualsNumber(d0, d1))
            return p0;

        const w: number = (d - d0) / (d1 - d0);
        let result = p0.add(p1.subtract(p0).scale(w))
        return result;
    };

    private indexOfDistance(d: number): number {
        let index: number = this.cumulativeLength.indexOf(d);

        if (index < 0) {
            for (let i = 0; i < this.cumulativeLength.length; i++) {
                if (this.cumulativeLength[i] > d) {
                    return i;
                }
            }
            return this.cumulativeLength.length;
        }

        return index;
    };
}
