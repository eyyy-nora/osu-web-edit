<script lang="ts">
import { useSpinner } from "./spinner";
import { ParsedSpinner } from "../../parse/types";

export let spinner: ParsedSpinner & { alpha: number; zIndex: number; percent: number; };

const update = useSpinner(spinner.percent, spinner.alpha, spinner.zIndex);
$: update(spinner.percent, spinner.alpha, spinner.zIndex);
</script>
