<script lang="ts">
import { snowflake } from "src/util/snowflake";

export let value: string = "";
export let shadowValue: string = "";
export let name: string = snowflake();
export let id: string = name;
export let placeholder: string | undefined = undefined;

let input: HTMLInputElement = undefined;

let prefixValue: string = ""; let restValue: string = "";
$: if (shadowValue.toLowerCase().includes(value.toLowerCase())) {
  const index = shadowValue.toLowerCase().indexOf(value.toLowerCase());
  prefixValue = shadowValue.slice(0, index);
  restValue = shadowValue.slice(index + value.length);
} else if (value === "") {
  prefixValue = "";
  restValue = shadowValue;
} else {
  prefixValue = restValue = "";
}

export function focus() {
  input.focus();
}

export function select() {
  input.select();
}

function calculateInputWidth(input: HTMLInputElement | undefined, value: string) {
  if (!input) return;
  const tmp = document.createElement("div");
  Object.assign(tmp.style, {
    cssText: getComputedStyle(input, null).cssText,
    width: "",
    position: "absolute",
    opacity: "0",
    whiteSpace: "pre",
  });
  tmp.innerText = value;
  input.parentNode.appendChild(tmp);
  const width = Math.max(1, tmp.clientWidth);
  input.parentNode.removeChild(tmp);
  input.style.width = `${width}px`;
}

$: calculateInputWidth(input, value);
</script>


<div class="input-container" on:click={focus}>
  <span class="shadow-prefix" tabindex="-1">{prefixValue}</span>
  <input bind:this={input} type="text" {name} {id} bind:value on:keydown|stopPropagation />
  <span class="shadow-suffix">{restValue}</span>
</div>

<style>
div.input-container {
  position: relative;
  display: flex;
  flex-direction: row;
  cursor: text;
  background-color: var(--colorBgLight);
  padding: .3rem .5rem;
  border-radius: .2rem;
}

input {
  color: var(--colorFgLight);
  outline: none;
  box-sizing: border-box;
}

input, .shadow-suffix, .shadow-prefix {
  padding: 0;
  margin: 0;
  background-color: transparent;
  outline: none;
  border: none;
  border-radius: 0;
}

.shadow-suffix, .shadow-prefix {
  color: var(--colorFgDarker);
  white-space: pre;
}

.shadow-prefix {
  flex-grow: 0;
  flex-shrink: 0;
  min-width: fit-content;
}
</style>
