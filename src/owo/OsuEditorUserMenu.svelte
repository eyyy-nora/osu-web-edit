<script lang="ts">
import { onMount, tick } from "svelte";
import { login, logout, me } from "../client";
import Button from "../component/form/Button.svelte";
import type { MeResponse } from "../../functions/types";

let loginButton;
let userData: MeResponse | undefined = undefined;

onMount(async () => {
  try { userData = await me("basic"); } catch {}
})

async function onLogoutClick() {
  await logout();
  userData = undefined;
  await tick();
  loginButton?.focus();
}
async function onLoginClick() {
  try { userData = await login(); }
  catch { userData = undefined; }
}
</script>

<div class="container" class:loggedIn={!!userData}>
  {#if !userData}
    <Button bind:this={loginButton} text="Login with osu!" pad on:click={onLoginClick} />
  {:else}
    <div class="userInfo">
      <img src={userData?.basic.avatar} alt="avatar" />
      <span>{userData?.basic.username}</span>
    </div>
  {/if}
  <div class="menu">
    <Button text="Logout" pad on:click={onLogoutClick} />
  </div>
</div>

<style>
.container {
  overflow: visible;
  height: 2.2rem;
}

.menu {
  z-index: 1;
  position: absolute;
  top: 2.2rem;
  right: 0;
  box-sizing: border-box;
  padding: .1rem .5rem .3rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s linear;
  background-color: var(--colorBgLighter);
}

.userInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--colorBgLighter);
  transition: background-color .15s linear;
}

.userInfo>img {
  width: 1.8rem;
  height: 1.8rem;
  margin: .3rem;
  text-anchor: middle;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: var(--shadowInner);
}

.userInfo>span {
  margin-right: .5rem;
  font-size: 1rem;
  color: var(--colorFgLight);
  font-weight: 500;
}

.loggedIn:hover>.userInfo,
.loggedIn:active>.userInfo,
.loggedIn:focus-within>.userInfo {
  background-color: var(--colorBgLightest);
}


.loggedIn:hover>.menu,
.loggedIn:active>.menu,
.loggedIn:focus-within>.menu
{
  opacity: 1;
  pointer-events: auto;
}

</style>
