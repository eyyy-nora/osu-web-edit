<script lang="ts">
import { ParsedHitCircle } from "../../parse/types";
import { HitCircleInitProps, useHitCircle } from "./hit-circle";

export let circle: ParsedHitCircle;
export let init: HitCircleInitProps;

const { update, move, refresh } = useHitCircle(circle, init);

$: update(init.alpha, init.zIndex, init.approach);
$: move(circle.x, circle.y);
$: refresh(init.combo, init.color, init.cs);
</script>
