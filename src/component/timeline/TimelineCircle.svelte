<script lang="ts">
export let time: number = 0;
export let end: number = 0;
export let index: number = 1;
</script>

<style>
div {
  position: absolute;
  box-sizing: border-box;
  width: 2.6rem;
  height: 2.6rem;
  margin: .3rem -1.3rem;
  border: 2px solid #8d8d8d;
  background: #2a3954;
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

<div style="--pos: {time}">
  <span>{index}</span>
</div>
