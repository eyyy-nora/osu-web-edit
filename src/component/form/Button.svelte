<script lang="ts">

export let text: string = "Submit";
export let big: boolean = false;
export let pad: boolean = false;

</script>

<button type="button" class:big class:pad on:click>
  <slot>
    <span>{text}</span>
  </slot>
</button>

<style>
button {
  max-height: 1.6rem;
  box-sizing: border-box;
  padding: .1rem .5rem;
  border: 1px solid var(--colorFgRegular);
  color: var(--colorFgLight);
  outline: none;
  background-color: var(--colorBgLighter);
}

button.pad {
  margin: .2rem .3rem;
}

button.big {
  max-height: 2.4rem;
  padding: .3rem 1rem;
}

button:focus, button:active, button:hover {
  color: var(--colorFgLighter);
  background-color: var(--colorBgLightest);
}
</style>
