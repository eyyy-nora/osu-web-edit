<script lang="ts">
import { numberToRgba } from "../../util/color";

export let time: number = 0;
export let end: number = 0;
export let combo: number = 1;
export let color: number = 0xffffff;
</script>

<style>
div {
  position: absolute;
  box-sizing: border-box;
  width: 2.6rem;
  height: 2.6rem;
  margin: .3rem -1.3rem;
  border: 2px solid #8d8d8d;
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
  color: #8d8d8d;
}
</style>

<div style="--pos: {time}; --color: {numberToRgba(color)}">
  <span>{combo}</span>
</div>
