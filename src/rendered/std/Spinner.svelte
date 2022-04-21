<script lang="ts">
import { useSpinner } from "./spinner";
import { BeatmapSpinner } from "src/io";

export let spinner: BeatmapSpinner & { alpha: number; zIndex: number; percent: number; };

const update = useSpinner(spinner.percent, spinner.alpha, spinner.zIndex);
$: update(spinner.percent, spinner.alpha, spinner.zIndex);
</script>
