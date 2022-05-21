import { Readable, derived } from "src/context/stores";
import {
  Beatmap, BeatmapInheritedTimingPoint,
  BeatmapLayer,
  BeatmapObject,
  BeatmapObjectBase, BeatmapUninheritedTimingPoint
} from "src/io";
import { colorToNumber } from "src/util/color";
import { floorToMultiple } from "src/util/numbers";
import { snowflake } from "src/util/snowflake";

export type BeatmapObjectWithCombo = BeatmapObjectBase & BeatmapObject & {
  id: string;
  index: number;
  color: number;
  combo: number;
  sv: number;
  beatLength: number;
  absoluteLength: number;
  tickRate: number;
}

export function createBeatmapObjectStore(
  $beatmap: Readable<Beatmap>
) {
  return derived([
    $beatmap
  ], ([
    beatmap,
  ]): BeatmapObjectWithCombo[] => {

    if (!beatmap) return [];

    const { colors: { colors: original }, timingPoints, difficulty: { sliderMultiplier, sliderTickRate }, layers } = beatmap;

    function sliderProps(time: number): [sv: number, beatLength: number] {
      let [uninherited] = timingPoints.filter(it => !it.inherited && it.time <= time).reverse();
      const [inherited] = timingPoints.filter(it => it.inherited && (uninherited && it.time >= uninherited.time) && it.time <= time).reverse();
      if (!uninherited) uninherited = timingPoints.filter(it => !it.inherited)[0];
      const { beatLength = 200 } = uninherited as BeatmapUninheritedTimingPoint ?? {};
      const { sliverVelocityMultiplier = -100 } = inherited as BeatmapInheritedTimingPoint ?? {};
      const sv = floorToMultiple(sliderMultiplier * 100 / -sliverVelocityMultiplier, 0.1, 0);
      return [sv, beatLength];
    }

    const colors = original.map(colorToNumber);

    let currentColorIndex = 0, currentColor = colors[0], combo = 1;
    function nextColor(skip: number = 0) {
      combo = 1;
      currentColorIndex = (currentColorIndex + skip + 1) % colors.length;
      currentColor = colors[currentColorIndex];
    }

    const sortedObjects: BeatmapObject[] = layers
      .filter(layer => layer.visible)
      .flatMap(layer => layer.objects)
      .sort((a, b) => a.time - b.time);

    return sortedObjects.map((object, index) => {
      if (object.newCombo || object.type === "spinner") nextColor(object.skipColors);
      else combo++;
      const [sv, beatLength] = sliderProps(object.time);
      let absoluteLength = "end" in object ? object.end - object.time : 0;
      if (object.type === "slider") absoluteLength = object.length * 2.25 * object.slides / sv;

      return {
        ...object,
        id: snowflake(),
        index,
        color: currentColor,
        combo,
        sv,
        beatLength,
        absoluteLength,
        tickRate: sliderTickRate,
      };
    });
  });
}
