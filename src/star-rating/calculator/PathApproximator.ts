import { Vector2 } from "./Objects/Vector2";
import { Precision } from "./Precision";

class PathApproximator {
    private bezier_tolerance: number = 0.25;
    private catmull_detail: number = 50;
    private circular_arc_tolerance: number = 0.1;

    approximateBezier(controlPoints: Vector2[]): Vector2[] {
        let output: Vector2[] = [];
        let count: number = controlPoints.length;

        if (count === 0)
            return output;

        let subdivisionBuffer1: Vector2[] = [];
        let subdivisionBuffer2: Vector2[] = [];
        for (let i = 0; i < count; i++) {
            subdivisionBuffer1.push(new Vector2(0, 0));
        }

        for (let i = 0; i < count * 2 - 1; i++) {
            subdivisionBuffer2.push(new Vector2(0, 0));
        }

        let toFlatten: Array<Vector2[]> = [];
        let freeBuffers: Array<Vector2[]> = [];

        const deepCopy: Vector2[] = [];
        controlPoints.forEach(c => {
            deepCopy.push(new Vector2(c.x, c.y));
        });

        toFlatten.push(deepCopy);

        let leftChild: Vector2[] = subdivisionBuffer2;

        while (toFlatten.length > 0) {
            let parent: Vector2[] = toFlatten.pop();
            if (this.bezierIsFlatEnough(parent)) {
                this.bezierApproximate(parent, output, subdivisionBuffer1, subdivisionBuffer2, count);
                freeBuffers.push(parent);
                continue;
            }

            let rightChild: Vector2[] = [];
            if (freeBuffers.length > 0)
                rightChild = freeBuffers.pop();
            else {
                for (let i = 0; i < count; i++) {
                    rightChild.push(new Vector2(0, 0));
                }
            }

            this.bezierSubdivide(parent, leftChild, rightChild, subdivisionBuffer1, count);

            for (let i = 0; i < count; i++) {
                parent[i] = leftChild[i];
            }

            toFlatten.push(rightChild);
            toFlatten.push(parent);
        }

        output.push(controlPoints[count - 1]);
        return output;
    };

    approximateCatmull(controlPoints: Vector2[]): Vector2[] {
        let result: Vector2[] = [];

        for (let i = 0; i < controlPoints.length - 1; i++) {
            const v1: Vector2 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
            const v2: Vector2 = controlPoints[i];
            const v3: Vector2 = i < controlPoints.length - 1 ? controlPoints[i + 1] : v2.add(v2).subtract(v1);
            const v4: Vector2 = i < controlPoints.length - 2 ? controlPoints[i + 2] : v3.add(v3).subtract(v2);

            for (let c = 0; c < this.catmull_detail; c++) {
                result.push(this.catmullFindPoint(v1, v2, v3, v4, c / this.catmull_detail));
                result.push(this.catmullFindPoint(v1, v2, v3, v4, (c + 1) / this.catmull_detail));
            }
        }

        return result;
    };

    approximateCircularArc(controlPoints: Vector2[]): Vector2[] {
        const a: Vector2 = controlPoints[0];
        const b: Vector2 = controlPoints[1];
        const c: Vector2 = controlPoints[2];

        const aSq: number = (b.subtract(c)).lengthSquared();
        const bSq: number = (a.subtract(c)).lengthSquared();
        const cSq: number = (a.subtract(b)).lengthSquared();

        if (Precision.almostEqualsNumber(aSq, 0) || Precision.almostEqualsNumber(bSq, 0) || Precision.almostEqualsNumber(cSq, 0))
            return [];

        const s: number = aSq * (bSq + cSq - aSq);
        const t: number = bSq * (aSq + cSq - bSq);
        const u: number = cSq * (aSq + bSq - cSq);

        const sum: number = s + t + u;

        if (Precision.almostEqualsNumber(sum, 0))
            return [];

        const centre: Vector2 = (a.scale(s).add(b.scale(t)).add(c.scale(u))).divide(sum);
        const dA: Vector2 = a.subtract(centre);
        const dC: Vector2 = c.subtract(centre);

        const r: number = dA.length();

        const thetaStart: number = Math.atan2(dA.y, dA.x);
        let thetaEnd: number = Math.atan2(dC.y, dC.x);

        while (thetaEnd < thetaStart) {
            thetaEnd += 2 * Math.PI;
        }

        let dir: number = 1;
        let thetaRange: number = thetaEnd - thetaStart;

        let orthoAtoC: Vector2 = c.subtract(a);
        orthoAtoC = new Vector2(orthoAtoC.y, -orthoAtoC.x);
        if (orthoAtoC.dot(b.subtract(a)) < 0) {
            dir = -dir;
            thetaRange = 2 * Math.PI - thetaRange;
        }

        const amountPoints: number = 2 * r <= this.circular_arc_tolerance ? 2 : Math.max(2, Math.ceil(thetaRange / (2 * Math.acos(1 - this.circular_arc_tolerance / r))));

        let output: Vector2[] = [];

        for (let i = 0; i < amountPoints; i++) {
            const fract: number = i / (amountPoints - 1);
            const theta: number = thetaStart + dir * fract * thetaRange;
            const o: Vector2 = new Vector2(Math.cos(theta), Math.sin(theta)).scale(r);
            output.push(centre.add(o));
        }       

        return output;
    };

    approximateLinear(controlPoints: Vector2[]): Vector2[] {
        return controlPoints;
    };

    private bezierIsFlatEnough (controlPoints: Vector2[]): boolean {
        for (let i = 1; i < controlPoints.length - 1; i++) {
            if ((controlPoints[i - 1].subtract(controlPoints[i].scale(2)).add(controlPoints[i + 1])).lengthSquared() > this.bezier_tolerance * this.bezier_tolerance * 4) {
                return false;
            }
        }
        return true;
    };

    private bezierApproximate (controlPoints: Vector2[], output: Vector2[], subdivisionBuffer1: Vector2[], subdivisionBuffer2: Vector2[], count: number): void {
        let l: Vector2[] = subdivisionBuffer2;
        let r: Vector2[] = subdivisionBuffer1;

        this.bezierSubdivide(controlPoints, l, r, subdivisionBuffer1, count);

        for (let i = 0; i < count - 1; i++) {
            l[count + i] = r[i + 1];
        }

        output.push(controlPoints[0]);
        for (let i = 1; i < count - 1; i++) {
            const index: number = 2 * i;
            const p: Vector2 = (l[index - 1].add(l[index].scale(2)).add(l[index + 1])).scale(0.25);
            output.push(p);
        }
    };

    private bezierSubdivide (controlPoints: Vector2[], l: Vector2[], r: Vector2[], subdivisionBuffer: Vector2[], count: number): void {
        let midpoints: Vector2[] = subdivisionBuffer;

        for (let i = 0; i < count; i++) {
            midpoints[i] = controlPoints[i];
        }

        for (let i = 0; i < count; i++) {
            l[i] = midpoints[0];
            r[count - i - 1] = midpoints[count - i - 1];

            for (let j = 0; j < count - i - 1; j++) {
                midpoints[j] = (midpoints[j].add(midpoints[j + 1])).divide(2);
            }
        }
    };

    private catmullFindPoint(vec1: Vector2, vec2: Vector2, vec3: Vector2, vec4: Vector2, t: number) {
        const t2: number = t * t;
        const t3: number = t * t2;

        let result: Vector2 = new Vector2(
            0.5 * (2 * vec2.x + (-vec1.x + vec3.x) * t + (2 * vec1.x - 5 * vec2.x + 4 * vec3.x - vec4.x) * t2 + (-vec1.x + 3 * vec2.x - 3 * vec3.x + vec4.x) * t3),
            0.5 * (2 * vec2.y + (-vec1.y + vec3.y) * t + (2 * vec1.y - 5 * vec2.y + 4 * vec3.y - vec4.y) * t2 + (-vec1.y + 3 * vec2.y - 3 * vec3.y + vec4.y) * t3)
        );

        return result;
    };
};

export default PathApproximator;