<nav>
  <ul>
    <slot />
  </ul>
</nav>

<style>
nav {
  width: 100%;
  padding: 0;
  margin: 0;
  background-color: var(--colorBgLighter);
  user-select: none;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0;
}
</style>
