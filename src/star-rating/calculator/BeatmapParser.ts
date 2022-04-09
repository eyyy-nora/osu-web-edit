import { HitType } from "./Objects/osu!/HitType";
import { PathType } from "./Objects/osu!/PathType";
import { Vector2 } from "./Objects/Vector2";
import { Beatmap } from "./Objects/osu!/Beatmap";
import { HitObject } from "./Objects/osu!/HitObjects/HitObject";
import { HitCircle } from "./Objects/osu!/HitObjects/HitCircle";
import { Slider } from "./Objects/osu!/HitObjects/Slider";
import { Spinner } from "./Objects/osu!/HitObjects/Spinner";
import { SliderPath } from "./SliderPath";
import { Precision } from "./Precision";

class BeatmapParser {
    beatmap: Beatmap;

    parseBeatmap(data: string, mods: string[]): Beatmap {
        if (!data) throw new Error('No beatmap found');

        this.beatmap = new Beatmap();
        let section = null;
        let lines = data.split('\n').map(line => line.trim());
        for (let line of lines) {
            if (line.startsWith('//')) continue
            if (!line) continue;
            if (!section && line.includes('osu file format v')) {
                this.beatmap.Version = parseInt(line.split('osu file format v')[1], 10);
                continue;
            }
            if (/^\s*\[(.+?)\]\s*$/.test(line)) {
                section = /^\s*\[(.+?)\]\s*$/.exec(line)[1];
                continue;
            }

            switch (section) {
                case 'General': {
                    let [key, value] = line.split(':').map(v => v.trim())
                    if (key === 'StackLeniency')
                        this.beatmap.StackLeniency = parseFloat(value);
                    break;
                }
                case 'Difficulty': {
                    let [key, value] = line.split(':').map(v => v.trim());
                    this.beatmap[section][key] = parseFloat(value);
                    break;
                }
                case 'TimingPoints': {
                    let split = line.split(',');

                    const time = +split[0] + (this.beatmap.Version < 5 ? 24 : 0);
                    const beatLength = +split[1];
                    const speedMultiplier = beatLength < 0 ? 100 / -beatLength : 1;
                    let timeSignature: number = 4;
                    if (split.length >= 3)
                        timeSignature = split[2][0] === '0' ? 4 : +split[2];

                    let timingChange: boolean = true;
                    if (split.length >= 7)
                        timingChange = split[6][0] === '1';

                    if (timingChange) {
                        this.beatmap.TimingPoints.push({
                            Time: time,
                            BeatLength: beatLength,
                            TimeSignature: timeSignature
                        });
                    }

                    this.beatmap.DifficultyTimingPoints.push({
                        Time: time,
                        SpeedMultiplier: speedMultiplier
                    });
                    break;
                }
                case 'HitObjects': {
                    let split = line.split(',');
                    const pos = new Vector2(+split[0], +split[1]);
                    const startTime = +split[2];
                    const hitType = +split[3];

                    let result: HitObject = null;

                    const scale: number = (1 - 0.7 * (this.getCircleSize(mods) - 5) / 5) / 2;
                    const radius: number = 64 * scale;

                    if (hitType & HitType.Normal) {
                        result = this.createCircle(pos, startTime, radius);
                    }

                    if (hitType & HitType.Slider) {
                        let pathType: PathType;
                        let length = 0;
                        let pointSplit = split[5].split('|');

                        let points = [new Vector2(0, 0)];
                        pointSplit.forEach(point => {
                            if (point.length === 1) {
                                switch (point) {
                                    case 'C':
                                        pathType = PathType.Catmull;
                                        break;
                                    case 'B':
                                        pathType = PathType.Bezier;
                                        break;
                                    case 'L':
                                        pathType = PathType.Linear;
                                        break;
                                    case 'P':
                                        pathType = PathType.PerfectCurve;
                                        break;
                                    default:
                                        pathType = PathType.Catmull;
                                        break;
                                }

                                return;
                            }

                            const temp = point.split(':');
                            points.push(new Vector2(+temp[0], +temp[1]).subtract(pos));
                        });

                        function isLinear(p: Vector2[]): boolean { return Precision.almostEqualsNumber(0, (p[1].y - p[0].y) * (p[2].x - p[0].x) - (p[1].x - p[0].x) * (p[2].y - p[0].y))}

                        if (points.length === 3 && pathType === PathType.PerfectCurve && isLinear(points))
                            pathType = PathType.Linear;

                        let repeatCount = +split[6];
                        repeatCount = Math.max(0, repeatCount - 1);

                        if (split.length > 7)
                            length = +split[7];

                        const slider: Slider = this.createSlider(pos, points, length, pathType, repeatCount, startTime, radius);
                        result = slider as HitCircle;
                    }

                    if (hitType & HitType.Spinner) {
                        const endTime = +split[5];
                        result = this.createSpinner(pos, startTime, endTime);
                    }

                    this.beatmap.HitObjects.push(result);
                }
            }
        }

        this.beatmap.HitObjects.forEach(h => {
            h.StackHeight = 0;
        });

        this.applyStacking(0, this.beatmap.HitObjects.length - 1);

        const scale: number = (1 - 0.7 * (this.getCircleSize(mods) - 5) / 5) / 2;
        this.beatmap.HitObjects.forEach(hitObject => {
            hitObject.calculateStackedPosition(scale);
        });

        return this.beatmap;
    };

    createCircle(pos: Vector2, startTime: number, radius: number): HitCircle {
        return new HitCircle(pos, startTime, radius);
    };

    createSlider(pos: Vector2, points: Vector2[], length: number, pathType: PathType, repeatCount: number, startTime: number, radius: number): Slider {
        const path = new SliderPath(pathType, points, Math.max(0, length));

        const speedMultiplier: number = this.getSpeedMultiplier(startTime);
        const beatLength: number = this.getBeatLength(startTime);

        return new Slider(pos, startTime, path, repeatCount, speedMultiplier, beatLength, this.beatmap.Difficulty, radius);
    };

    createSpinner(pos: Vector2, startTime: number, endTime: number): Spinner {
        return new Spinner(pos, startTime, endTime);
    };

    getSpeedMultiplier(startTime: number): number {
        const currentTimingPoint = this.getTimingPoints(startTime, this.beatmap.DifficultyTimingPoints);
        return currentTimingPoint.SpeedMultiplier;
    };

    getBeatLength(startTime: number): number {
        const currentTimingPoint = this.getTimingPoints(startTime, this.beatmap.TimingPoints);
        return currentTimingPoint.BeatLength;
    };

    getTimingPoints(startTime: number, timingPoints: Array<any>): any {
        timingPoints.sort((a, b) => {
            return a.Time - b.Time
        });

        let currentTimingPoint: number;
        for (let i = 0; i < timingPoints.length; i++) {
            if (timingPoints[i].Time > startTime) {
                currentTimingPoint = i - 1;
                break;
            }
        }

        if (currentTimingPoint < 0) {
            console.warn("Warning: first timing point after current hit object (", startTime, "). Defaulting to first timing point of the map");
            currentTimingPoint = 0;
        }
        if (currentTimingPoint === undefined)
            currentTimingPoint = timingPoints.length - 1;

        return timingPoints[currentTimingPoint];
    };

    applyStacking(startIndex: number, endIndex: number): void {
        const stack_distance: number = 3;

        let TimePreempt: number = 600;
        if (this.beatmap.Difficulty.ApproachRate > 5)
            TimePreempt = 1200 + (450 - 1200) * (this.beatmap.Difficulty.ApproachRate - 5) / 5;
        else if (this.beatmap.Difficulty.ApproachRate < 5)
            TimePreempt = 1200 - (1200 - 1800) * (5 - this.beatmap.Difficulty.ApproachRate) / 5;
        else
            TimePreempt = 1200;

        let extendedEndIndex: number = endIndex;

        if (endIndex < this.beatmap.HitObjects.length - 1) {
            for (let i = endIndex; i >= startIndex; i--) {
                let stackBaseIndex: number = i;
                for (let n = stackBaseIndex + 1; n < this.beatmap.HitObjects.length; n++) {
                    const stackBaseObject: HitObject = this.beatmap.HitObjects[stackBaseIndex];
                    if (stackBaseObject instanceof Spinner)
                        break;

                    const objectN: HitObject = this.beatmap.HitObjects[n];
                    if (objectN instanceof Spinner)
                        continue;

                    const endTime: number = stackBaseObject instanceof HitCircle ? stackBaseObject.StartTime : (stackBaseObject as Slider).EndTime;
                    const stackThresHold: number = TimePreempt * this.beatmap.StackLeniency;

                    if (objectN.StartTime - endTime > stackThresHold)
                        break;

                    const endPositionDistanceCheck: boolean = stackBaseObject instanceof Slider ? (stackBaseObject as Slider).EndPosition.distance(objectN.Position) < stack_distance : false;
                    if (stackBaseObject.Position.distance(objectN.Position) < stack_distance || endPositionDistanceCheck) {
                        stackBaseIndex = n;
                        objectN.StackHeight = 0;
                    }
                }

                if (stackBaseIndex > extendedEndIndex) {
                    extendedEndIndex = stackBaseIndex;
                    if (extendedEndIndex === this.beatmap.HitObjects.length - 1)
                        break;
                }
            }
        }

        let extendedStartIndex: number = startIndex;
        for (let i = extendedEndIndex; i > startIndex; i--) {
            let n: number = i;

            let objectI: HitObject = this.beatmap.HitObjects[i];
            if (objectI.StackHeight !== 0 || objectI instanceof Spinner)
                continue;

            const stackThresHold: number = TimePreempt * this.beatmap.StackLeniency;

            if (objectI instanceof HitCircle) {
                while (--n >= 0) {
                    const objectN: HitObject = this.beatmap.HitObjects[n];
                    if (objectN instanceof Spinner)
                        continue;

                    const endTime: number = objectN instanceof HitCircle ? objectN.StartTime : (objectN as Slider).EndTime;

                    if (objectI.StartTime - endTime > stackThresHold)
                        break;

                    if (n < extendedStartIndex) {
                        objectN.StackHeight = 0;
                        extendedStartIndex = n;
                    }

                    const endPositionDistanceCheck: boolean = objectN instanceof Slider ? (objectN as Slider).EndPosition.distance(objectI.Position) < stack_distance : false;
                    if (endPositionDistanceCheck) {
                        const offset: number = objectI.StackHeight - objectN.StackHeight + 1;
                        for (let j = n + 1; j <= i; j++) {
                            const objectJ: HitObject = this.beatmap.HitObjects[j];
                            if ((objectN as Slider).EndPosition.distance(objectJ.Position) < stack_distance) {
                                objectJ.StackHeight -= offset;
                            }
                        }

                        break;
                    }

                    if (objectN.Position.distance(objectI.Position) < stack_distance) {
                        objectN.StackHeight = objectI.StackHeight + 1;
                        objectI = objectN;
                    }
                }
            }
            else if (objectI instanceof Slider) {
                while (--n >= startIndex) {
                    const objectN: HitObject = this.beatmap.HitObjects[n];
                    if (objectN instanceof Spinner)
                        continue;

                    if (objectI.StartTime - objectN.StartTime > stackThresHold)
                        break;

                    const objectNEndPosition: Vector2 = objectN instanceof HitCircle ? objectN.Position : (objectN as Slider).EndPosition;
                    if (objectNEndPosition.distance(objectI.Position) < stack_distance) {
                        objectN.StackHeight = objectI.StackHeight + 1;
                        objectI = objectN;
                    }
                }
            }
        }
    };

    getCircleSize(mods: string[]): number {
        if (mods.includes("HR"))
            return Math.min(this.beatmap.Difficulty.CircleSize * 1.3, 10);
        if (mods.includes("EZ"))
            return this.beatmap.Difficulty.CircleSize * 0.5;
        return this.beatmap.Difficulty.CircleSize;
    };
};

export default BeatmapParser;