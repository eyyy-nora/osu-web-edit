<script lang="ts">
import { onDestroy } from "svelte";
import type { OwoId } from "../../icons";
import { allMatches } from "../../util/regex";

export let action: (() => void) | undefined = undefined;

export let name = "<Unknown>";
export let keybind = "";
export let disabled = false;

type KeyModifier = "ctrl" | "shift" | "alt" | "cmd";

function runAction() {
  if (disabled || !action) return false;
  action();
  return true;
}

function keyModifiers(keybind: string): KeyModifier[] {
  return allMatches(keybind, /(ctrl|shift|alt|cmd)\+/g).map(([, key]) => key) as KeyModifier[];
}

let key: string, mods: KeyModifier[], icons: OwoId[];
$: key = keybind.replace(/(ctrl|shift|alt|cmd)\+/g, "");
$: mods = keyModifiers(keybind);
$: icons = mods.map(mod => {
  switch (mod) {
    case "ctrl":
      return "control";
    case "shift":
      return "shift";
    case "alt":
      return "alt";
    case "cmd":
      return "command";
  }
});

function registerKeyBind(key: string, mods: KeyModifier[]) {
  if (unregister) unregister();
  if (!key) return;

  if (key === "Space") key = " ";
  const hasCtrl = mods.includes("ctrl");
  const hasShift = mods.includes("shift");
  const hasAlt = mods.includes("alt");
  const hasCmd = mods.includes("cmd");

  const ignoredElements = [
    HTMLInputElement,
    HTMLTextAreaElement,
    HTMLButtonElement,
    HTMLSelectElement,
    HTMLAnchorElement,
  ];

  function listener(e: KeyboardEvent) {
    const { shiftKey, altKey, ctrlKey, metaKey, key: eventKey, target } = e;
    if (ignoredElements.find(it => target instanceof it)) return;
    if (eventKey !== key
      || shiftKey !== hasShift
      || ctrlKey !== hasCtrl
      || altKey !== hasAlt
      || metaKey !== hasCmd
    ) return;
    if (runAction()) e.preventDefault();
  }

  window.addEventListener("keydown", listener);
  return () => window.removeEventListener("keydown", listener);
}

let unregister: (() => void) | undefined;
$: unregister = registerKeyBind(key, mods);

onDestroy(() => unregister());

</script>

<li>
  <div class="text" on:click={runAction}>
    <span class="name">{name}</span>
    {#if keybind}
      <span class="keybind">
        {#each icons as icon}
          <i class="icon icon-{icon}"/>
        {/each}
        <span class="key">
          {key}
        </span>
      </span>
    {/if}
  </div>
  {#if $$slots.default}
    <ul>
      <slot/>
    </ul>
  {/if}
</li>


<style>
li {
  padding: .3rem .6rem;
  position: relative;
  word-break: keep-all;
  white-space: nowrap;
  color: var(--colorFgLight);
  transition: background-color .1s linear;
}

.text {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}

.keybind {
  float: right;
  margin-left: 2rem;
  font-family: var(--fontMono);
  font-size: .8em;
  color: var(--colorFgRegular);
}

.key {
  margin-left: -.3rem;
  text-transform: capitalize;
}

li:hover, li:focus, li:focus-within {
  background-color: var(--colorBgLightest);
  color: var(--colorFgLighter);
}

ul {
  display: none;
  opacity: 0;
  position: absolute;
  left: 0;
  list-style: none;
  padding: 0;
  z-index: 1000;
  width: content-box;
  background-color: var(--colorBgLighter);
  margin-top: .2rem;
  transition: opacity .1s linear;
}

li:hover ul, li:focus ul, li:focus-within ul {
  display: block;
  box-shadow: var(--shadowRegular);
  opacity: 1;
}
</style>
