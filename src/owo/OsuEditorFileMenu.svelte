<script lang="ts">
import { login } from "../client";
import FileMenu from "../component/file-menu/FileMenu.svelte";
import FileMenuItem from "../component/file-menu/FileMenuItem.svelte";
import Button from "../component/form/Button.svelte";

async function onLoginClick() {
  await login();
}

</script>

<FileMenu>
  <FileMenuItem name="File">
    <FileMenuItem name="New" keybind="ctrl+n" />
    <FileMenuItem name="Open..." keybind="ctrl+o" />
    <FileMenuItem name="Import..." keybind="ctrl+shift+o" />
    <FileMenuItem name="Save" keybind="ctrl+s" />
    <FileMenuItem name="Save As..." keybind="ctrl+shift+s" />
    <FileMenuItem name="Export" />
  </FileMenuItem>
  <FileMenuItem name="Edit">
    <FileMenuItem name="Undo" keybind="ctrl+z" />
    <FileMenuItem name="Redo" keybind="ctrl+y" />
    <FileMenuItem name="Copy" keybind="ctrl+c" />
    <FileMenuItem name="Cut" keybind="ctrl+x" />
    <FileMenuItem name="Paste" keybind="ctrl+v" />
    <FileMenuItem name="Delete" keybind="del" />
    <FileMenuItem name="Rotate Selection" keybind="ctrl+r" />
    <FileMenuItem name="Scale Selection" keybind="ctrl+h" />
  </FileMenuItem>
  <FileMenuItem name="View">
    <FileMenuItem name="Toggle Grids" keybind="ctrl+g" />
    <FileMenuItem name="Configure Grids" keybind="ctrl+shift+g" />
  </FileMenuItem>
  <Button slot="end" text="Login with osu!" pad on:click={onLoginClick} />
</FileMenu>
