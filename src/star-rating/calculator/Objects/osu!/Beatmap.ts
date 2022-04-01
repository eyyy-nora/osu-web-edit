import { HitObject } from "./HitObjects/HitObject";

/**
 * Class for beatmaps
 */
export class Beatmap {
    /**
     * Difficulty settings of the beatmap
     */
    public Difficulty: {
        HPDrainRate: number,
        CircleSize: number,
        OverallDifficulty: number,
        ApproachRate: number,
        SliderMultiplier: number,
        SliderTickRate: number
    };

    /**
     * Hit objects in this beatmap
     */
    public HitObjects: HitObject[];

    /**
     * Timing points in this beatmap, focussed on timing settings
     */
    public TimingPoints: Array<{
        Time: number,
        BeatLength: number,
        TimeSignature: number
    }>;

    /**
     * Timing points in this beatmap, focussed on difficulty
     */
    public DifficultyTimingPoints: Array<{
        Time: number,
        SpeedMultiplier: number
    }>;

    /**
     * .osu file version
     */

    /**
     * Stack leniency used in the beatmap
     */
    public Version: number = 0;
    public StackLeniency: number = 0;

    constructor() {
        this.Difficulty = {
            HPDrainRate: 0,
            CircleSize: 0,
            OverallDifficulty: 0,
            ApproachRate: 0,
            SliderMultiplier: 0,
            SliderTickRate: 0
        };

        this.HitObjects = [];
        this.TimingPoints = [];
        this.DifficultyTimingPoints = [];
    };    
};