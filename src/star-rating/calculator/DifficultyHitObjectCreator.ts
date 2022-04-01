import { HitObject } from "./Objects/osu!/HitObjects/HitObject";
import { DifficultyHitObject } from "./Objects/osu!/HitObjects/DifficultyHitObject";
import { Slider } from "./Objects/osu!/HitObjects/Slider";
import { Spinner } from "./Objects/osu!/HitObjects/Spinner";
import { Vector2 } from "./Objects/Vector2";

class DifficultyHitObjectCreator {
    private difficultyHitObjects: DifficultyHitObject[];

    private lastLastObject: HitObject;
    private lastObject: HitObject;
    private currentObject: HitObject;
    private timeRate: number;

    private normalized_radius: number = 52;

    private TravelDistance: number = 0;
    private JumpDistance: number = 0;
    private Angle: number = 0;
    private DeltaTime: number = 0;
    private StrainTime: number = 0;

    convertToDifficultyHitObjects(hitObjects: HitObject[], timeRate: number): DifficultyHitObject[] {
        this.difficultyHitObjects = [];

        for (let i = 1; i < hitObjects.length; i++) {
            const lastLast: HitObject = i > 1 ? hitObjects[i - 2] : null;
            const last: HitObject = hitObjects[i - 1];
            const current: HitObject = hitObjects[i];

            const difficultyHitObject: DifficultyHitObject = this.createDifficultyHitObject(lastLast, last, current, timeRate);
            this.difficultyHitObjects.push(difficultyHitObject);
        }

        return this.difficultyHitObjects;
    };

    createDifficultyHitObject(lastLast: HitObject, last: HitObject, current: HitObject, timeRate: number): DifficultyHitObject {
        this.lastLastObject = lastLast;
        this.lastObject = last;
        this.currentObject = current;
        this.timeRate = timeRate;

        this.setDistances();
        this.setTimingValues();

        return new DifficultyHitObject(this.currentObject, this.lastObject, this.lastLastObject, this.TravelDistance, this.JumpDistance, this.Angle, this.DeltaTime, this.StrainTime);
    };

    setDistances(): void {
        this.TravelDistance = 0;
        this.JumpDistance = 0;
        this.Angle = 0;
        this.DeltaTime = 0;
        this.StrainTime = 0;

        let scalingFactor: number = this.normalized_radius / this.currentObject.Radius;
        if (this.currentObject.Radius < 30) {
            var smallCircleBonus: number = Math.min(30 - this.currentObject.Radius, 5) / 50;
            scalingFactor *= 1 + smallCircleBonus;
        }

        if (this.lastObject instanceof Slider) {
            let lastSlider = this.lastObject as Slider;
            this.computeSliderCursorPosition(lastSlider);
            this.TravelDistance = lastSlider.LazyTravelDistance * scalingFactor;
        }

        const lastCursorPosition: Vector2 = this.getEndCursorPosition(this.lastObject);

        if (!(this.currentObject instanceof Spinner))
            this.JumpDistance = this.currentObject.StackedPosition.scale(scalingFactor).subtract(lastCursorPosition.scale(scalingFactor)).length();

        if (this.lastLastObject !== null) {
            const lastLastCursorPosition: Vector2 = this.getEndCursorPosition(this.lastLastObject);

            const v1: Vector2 = lastLastCursorPosition.subtract(this.lastObject.StackedPosition);
            const v2: Vector2 = this.currentObject.StackedPosition.subtract(lastCursorPosition);

            const dot: number = v1.dot(v2);
            const det: number = v1.x * v2.y - v1.y * v2.x;

            this.Angle = Math.abs(Math.atan2(det, dot));
        }
    };

    setTimingValues(): void {
        this.DeltaTime = (this.currentObject.StartTime - this.lastObject.StartTime) / this.timeRate;
        this.StrainTime = Math.max(50, this.DeltaTime);
    };

    computeSliderCursorPosition(slider: Slider): void {
        if (slider.LazyEndPosition !== null && slider.LazyEndPosition !== undefined)
            return;
        slider.LazyEndPosition = slider.StackedPosition;
        slider.LazyTravelDistance = 0;

        const approxFollowCircleRadius: number = slider.Radius * 3;
        function computeVertex(t: number): void {
            let progress: number = (t - slider.StartTime) / slider.SpanDuration;
            if (progress % 2 >= 1)
                progress = 1 - progress % 1;
            else
                progress = progress % 1;

            let diff: Vector2 = slider.StackedPosition.add(slider.Path.PositionAt(progress)).subtract(slider.LazyEndPosition);
            let dist: number = diff.length();

            if (dist > approxFollowCircleRadius) {
                diff.normalize();
                dist -= approxFollowCircleRadius;
                slider.LazyEndPosition = slider.LazyEndPosition.add(diff.scale(dist));
                slider.LazyTravelDistance = slider.LazyTravelDistance === undefined ? dist : slider.LazyTravelDistance += dist;
            }
        };

        const scoringTimes: number[] = slider.NestedHitObjects.slice(1, slider.NestedHitObjects.length).map(t => { return t.StartTime; });
        scoringTimes.forEach(time => {
            computeVertex(time);
        });
    };

    getEndCursorPosition(object: HitObject): Vector2 {
        let pos: Vector2 = object.StackedPosition;


        if (object instanceof Slider) {
            this.computeSliderCursorPosition(object);
            pos = object.LazyEndPosition !== null && object.LazyEndPosition !== undefined ? object.LazyEndPosition : pos;
        }

        return pos;
    };
};

export default DifficultyHitObjectCreator;