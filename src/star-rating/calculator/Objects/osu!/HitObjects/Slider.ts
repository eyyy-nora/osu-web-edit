import { HitObject } from "./HitObject";
import { Vector2 } from "../../../../../util/Vector2";
import { SliderPath } from "../../../SliderPath"
import { HeadCircle } from "./SliderObjects/HeadCircle";
import { TailCircle } from "./SliderObjects/TailCircle";
import { SliderTick } from "./SliderObjects/SliderTick";
import { RepeatPoint } from "./SliderObjects/RepeatPoint";

/**
 * Class for sliders
 */
export class Slider extends HitObject {
    EndPosition: Vector2;
    EndTime: number;
    Duration: number;
    Path: SliderPath;
    RepeatCount: number;
    NestedHitObjects: Array<HitObject>;
    TickDistance: number;
    LazyEndPosition: Vector2;
    LazyTravelDistance: number;
    SpanDuration: number;
    LegacyLastTickOffset: number = 36;
    HeadCircle: HeadCircle;
    TailCircle: TailCircle;
    private Velocity: number;
    private SpanCount: number;

    /**
     *
     * @param pos The raw position of the slider (as listed in the .osu file)
     * @param startTime The start time of the slider
     * @param path The calculated slider path of the slider
     * @param repeatCount The number of repeats this slider has
     * @param speedMultiplier The speed multiplier of this slider compared to the base bpm
     * @param beatLength The length of one beat in ms at this point in the map
     * @param mapDifficulty The difficulty settings of the beatmap
     * @param radius The radius of the slider head circle
     */
    constructor(pos: Vector2, startTime: number, path: SliderPath, repeatCount: number, speedMultiplier: number, beatLength: number, mapDifficulty: any, radius: number) {
        super(pos, startTime, radius);
        this.Path = path;
        this.EndPosition = this.Position.add(this.Path.PositionAt(1));

        this.calculateEndTimeAndTickDistance(speedMultiplier, beatLength, mapDifficulty, repeatCount, startTime, path.expectedDistance);
        this.Duration = this.EndTime - startTime;
        this.RepeatCount = repeatCount;

        this.createNestedHitObjects();
    };

    private calculateEndTimeAndTickDistance(speedMultiplier: number, beatLength: number, mapDifficulty: any, repeatCount: number, startTime: number, expectedDistance: number): void {
        const scoringDistance: number = 100 * mapDifficulty.SliderMultiplier * speedMultiplier;
        this.Velocity = scoringDistance / beatLength;
        this.SpanCount = repeatCount + 1;
        this.TickDistance = scoringDistance / mapDifficulty.SliderTickRate * 1;
        this.EndTime = startTime + this.SpanCount * expectedDistance / this.Velocity;
    };

    /**
     * Creates the nested hit objects (head and tail circle, slider ticks and repeat points) for this slider
     */
    private createNestedHitObjects(): void {
        this.NestedHitObjects = [];

        this.createSliderEnds();
        this.createSliderTicks();
        this.createRepeatPoints();

        this.NestedHitObjects.sort((a, b) => {
            return a.StartTime - b.StartTime;
        });

        this.TailCircle.StartTime = Math.max(this.StartTime + this.Duration / 2, this.TailCircle.StartTime - this.LegacyLastTickOffset);
    };

    private createSliderEnds(): void {
        this.HeadCircle = new HeadCircle(this.Position, this.StartTime, this.Radius);
        this.TailCircle = new TailCircle(this.EndPosition, this.EndTime, this.Radius);

        this.NestedHitObjects.push(this.HeadCircle);
        this.NestedHitObjects.push(this.TailCircle);
    };

    private createSliderTicks(): void {
        const max_length: number = 100000;

        const length: number = Math.min(max_length, this.Path.expectedDistance);
        const tickDistance: number = Math.min(Math.max(this.TickDistance, 0), length);

        if (tickDistance === 0)
            return;

        const minDistanceFromEnd: number = this.Velocity * 10;
        this.SpanDuration = this.Duration / this.SpanCount;

        for (let span = 0; span < this.SpanCount; span++) {
            const spanStartTime: number = this.StartTime + span * this.SpanDuration;
            const reversed: boolean = span % 2 === 1;

            for (let d = tickDistance; d <= length; d += tickDistance) {
                if (d > length - minDistanceFromEnd)
                    break;

                const distanceProgress: number = d / length;
                const timeProgress: number = reversed ? 1 - distanceProgress : distanceProgress;

                const sliderTickPosition = this.Position.add(this.Path.PositionAt(distanceProgress));
                const sliderTick = new SliderTick(sliderTickPosition, spanStartTime + timeProgress * this.SpanDuration, span, spanStartTime, this.Radius);
                this.NestedHitObjects.push(sliderTick);
            }
        }
    };

    private createRepeatPoints(): void {
        for (let repeatIndex = 0, repeat = 1; repeatIndex < this.RepeatCount; repeatIndex++, repeat++) {
            const repeatPosition: Vector2 = this.Position.add(this.Path.PositionAt(repeat % 2));
            const repeatPoint = new RepeatPoint(repeatPosition, this.StartTime + repeat * this.SpanDuration, repeatIndex, this.SpanDuration, this.Radius);
            this.NestedHitObjects.push(repeatPoint);
        }
    };
};
