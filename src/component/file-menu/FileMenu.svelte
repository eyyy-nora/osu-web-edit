<nav>
  {#if $$slots.start}
    <div class="start">
      <slot name="start" />
    </div>
  {/if}
  <ul>
    <slot />
  </ul>
  {#if $$slots.end}
    <div class="end">
      <slot name="end" />
    </div>
  {/if}
</nav>

<style>
nav {
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: var(--colorBgLighter);
  user-select: none;
  display: flex;
  flex-direction: row;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  padding: 0;
  margin: 0;
}
</style>
