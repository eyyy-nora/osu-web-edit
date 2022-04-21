import { Readable, derived } from "src/context/stores";
import { Beatmap } from "src/io";
import { colorToNumber } from "src/util/color";
import { snowflake } from "src/util/snowflake";



export function createBeatmapObjectStore(beatmap: Readable<Beatmap>) {
  return derived([beatmap], ([beatmap]) => {
    if (!beatmap) return [];

    const { colors: { colors: original } } = beatmap;
    const colors = original.map(colorToNumber);

    let currentColorIndex = 0, currentColor = colors[0], combo = 1;
    function nextColor(skip: number = 0) {
      combo = 1;
      currentColorIndex = (currentColorIndex + skip + 1) % colors.length;
      currentColor = colors[currentColorIndex];
    }

    return beatmap.objects.map((object, index) => {
      const id = snowflake();

      if (object.newCombo || object.type === "spinner") nextColor(object.skipColors);
      else combo++;

      return {
        ...object,
        id,
        index,
        color: currentColor,
        combo,
      };
    });
  });
}
