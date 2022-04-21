<script lang="ts">
import { SliderInitProps, useSlider } from "./slider";
import { BeatmapSlider } from "src/io";

export let slider: BeatmapSlider;
export let init: SliderInitProps;

const { update, move, refresh, updatePath } = useSlider(slider, init);

$: update(init.alpha, init.zIndex, init.approach);
$: move(slider.x, slider.y);
$: refresh(init.combo, init.color, init.cs);
$: updatePath(slider.x, slider.y, slider.sliderType, slider.path, init.cs);

</script>
