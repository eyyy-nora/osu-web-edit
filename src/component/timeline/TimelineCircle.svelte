<script lang="ts">
import { BeatmapObjectWithCombo } from "src/context";
import { numberToRgba } from "../../util/color";

export let object: BeatmapObjectWithCombo;

export let time: number = 0;
export let end: number = 0;
</script>

<style>
div {
  position: absolute;
  box-sizing: border-box;
  width: 2.6rem;
  height: 2.6rem;
  margin: .3rem -1.3rem;
  border: 2px solid #ffffff;
  background: var(--color);
  border-radius: 1000000rem;
  transform: translateX(calc(var(--pos) * var(--timelineSize)));
  transition: transform .15s ease-out;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

span {
  font-weight: bold;
  font-size: 1.1rem;
  color: #ffffff;
}
</style>

<div style="--pos: {time}; --color: {numberToRgba(object.color)}">
  <span>{object.combo}</span>
</div>
