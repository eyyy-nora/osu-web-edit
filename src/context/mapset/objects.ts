import { Readable, derived } from "src/context/stores";
import { Beatmap, BeatmapLayer, BeatmapObject } from "src/io";
import { colorToNumber } from "src/util/color";
import { snowflake } from "src/util/snowflake";



export function createBeatmapObjectStore($beatmap: Readable<Beatmap>, $visibleLayers: Readable<BeatmapLayer[]>, $mainVisible: Readable<boolean>) {
  return derived([$beatmap, $visibleLayers, $mainVisible], ([beatmap, visibleLayers, mainVisible]) => {

    if (!beatmap) return [];

    const { colors: { colors: original } } = beatmap;
    const colors = original.map(colorToNumber);

    let currentColorIndex = 0, currentColor = colors[0], combo = 1;
    function nextColor(skip: number = 0) {
      combo = 1;
      currentColorIndex = (currentColorIndex + skip + 1) % colors.length;
      currentColor = colors[currentColorIndex];
    }

    const sortedObjects: BeatmapObject[] = [
      ...(mainVisible ? beatmap.objects : []),
      ...visibleLayers.flatMap(layer => layer.objects),
    ].sort((a, b) => a.time - b.time);

    return sortedObjects.map((object, index) => {
      if (object.newCombo || object.type === "spinner") nextColor(object.skipColors);
      else combo++;

      return {
        ...object,
        id: snowflake(),
        index,
        color: currentColor,
        combo,
      };
    });
  });
}
