<script lang="ts">
import type { OwoId } from "../../icons";
import { allMatches } from "../../util/regex";



export let name = "<Unknown>";
export let keybind = "";

let keybindIcons: OwoId[];
$: keybindIcons = allMatches(keybind, /(ctrl|shift|alt|cmd)\+/g).map(([, key]): OwoId => {
  switch (key) {
    case "ctrl":
      return "control";
    case "shift":
      return "shift";
    case "alt":
      return "alt";
    case "cmd":
      return "command";
    default:
      return "mania";
  }
});

let keybindRaw: string;
$: keybindRaw = keybind.replace(/(ctrl|shift|alt|cmd)\+/g, "");
</script>

<li>
  <div class="text">
    <span class="name">{name}</span>
    {#if keybind}
      <span class="keybind">
        {#each keybindIcons as icon}
          <i class="icon icon-{icon}"/>
        {/each}
        <span class="key">
          {keybindRaw}
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
  padding: .2rem .6rem;
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
  z-index: 1;
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
