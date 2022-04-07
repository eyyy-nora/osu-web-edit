<script lang="ts">
export let time: number = 0;
export let end: number = 0;
</script>

<style>
div {
  --pos: 0;
  --end: var(--pos);
  position: absolute;
  box-sizing: border-box;
  width: 2.6rem;
  height: 2.6rem;
  margin: .3rem -1.3rem;
  border: 2px solid #aaaaaa;
  background-color: rgba(255, 255, 255, .2);
  border-radius: 1000000rem;
  transform: translateX(calc(var(--pos) * var(--timelineSize)));
  transition: transform .15s ease-out;
  left: 0;
}

div.body {
  width: calc(2.6rem + (var(--end) - var(--pos)) * var(--timelineSize));
  box-shadow: var(--shadowInner);
}

div.circle {

}

span {
  display: block;
  box-sizing: border-box;
  margin: calc(1.1rem - 2px);
  width: .4rem;
  height: .4rem;
  overflow: hidden;
  border-radius: .2rem;
  background-color: #aaaaaa;
}
</style>

<div class="body" style="--pos: {time}; --end: {end}" />
<div class="circle" style="--pos: {time}">
  <span />
</div>
