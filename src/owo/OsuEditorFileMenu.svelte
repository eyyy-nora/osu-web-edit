<script lang="ts">
import { getMapsetContext } from "src/context/mapset-context";
import { withFileDialog } from "src/util/open-file-dialog";
import { createEventDispatcher } from "svelte";
import FileMenu from "../component/file-menu/FileMenu.svelte";
import FileMenuItem from "../component/file-menu/FileMenuItem.svelte";
import OsuEditorUserMenu from "./OsuEditorUserMenu.svelte";

const emit = createEventDispatcher<{
  "play-pause": void;
}>()

function logAction(name: string) {
  return () => console.log(name);
}

const { loadMapset, downloadMapset, audio } = getMapsetContext();

function importBeatmap() {
  withFileDialog(loadMapset);
}

function openLink(link: string) {
  return () => window.open(link, "_blank");
}

</script>

<FileMenu>
  <FileMenuItem name="File">
    <FileMenuItem name="New" keybind="alt+shift+N" action={logAction("file-new")} />
    <FileMenuItem name="Open..." keybind="ctrl+O" action={logAction("file-open")} />
    <FileMenuItem name="Import..." keybind="ctrl+shift+O" action={importBeatmap} />
    <FileMenuItem name="Save" keybind="ctrl+S" action={logAction("file-save")} />
    <FileMenuItem name="Save As..." keybind="ctrl+shift+S" action={logAction("file-save-as")} />
    <FileMenuItem name="Export" action={() => downloadMapset()} />
  </FileMenuItem>
  <FileMenuItem name="Edit">
    <FileMenuItem name="Undo" keybind="ctrl+Z" action={logAction("edit-undo")} />
    <FileMenuItem name="Redo" keybind="ctrl+Y" action={logAction("edit-redo")} />
    <FileMenuItem name="Copy" keybind="ctrl+C" action={logAction("edit-copy")} />
    <FileMenuItem name="Cut" keybind="ctrl+X" action={logAction("edit-cut")} />
    <FileMenuItem name="Paste" keybind="ctrl+V" action={logAction("edit-paste")} />
    <FileMenuItem name="Delete" keybind="Delete" action={logAction("edit-delete")} />
    <FileMenuItem name="Rotate Selection" keybind="ctrl+R" action={logAction("edit-rotate")} />
    <FileMenuItem name="Scale Selection" keybind="ctrl+H" action={logAction("edit-scale")} />
  </FileMenuItem>
  <FileMenuItem name="Insert">
    <FileMenuItem name="Circle" action={logAction("insert-circle")} />
    <FileMenuItem name="Slider" action={logAction("insert-slider")} />
    <FileMenuItem name="Spinner" action={logAction("insert-spinner")} />
    <FileMenuItem name="Break" action={logAction("insert-break")} />
    <FileMenuItem name="Timing Point" action={logAction("insert-timing-point")} />
    <FileMenuItem name="Polygon Notes" action={logAction("insert-polygon-notes")} />
  </FileMenuItem>
  <FileMenuItem name="View">
  </FileMenuItem>
  <FileMenuItem name="Navigate">
    <FileMenuItem name="Next Tick" keybind="ArrowRight" action={logAction("nav-next-tick")} />
    <FileMenuItem name="Previous Tick" keybind="ArrowLeft" action={logAction("nav-prev-tick")} />
    <FileMenuItem name="Next Object" keybind="shift+ArrowRight" action={logAction("nav-next-object")} />
    <FileMenuItem name="Previous Object" keybind="shift+ArrowLeft" action={logAction("nav-prev-object")} />
    <FileMenuItem name="Next Bookmark" keybind="ctrl+ArrowRight" action={logAction("nav-next-bookmark")} />
    <FileMenuItem name="Previous Bookmark" keybind="ctrl+ArrowLeft" action={logAction("nav-prev-bookmark")} />
    <FileMenuItem name="Next Timing Point" keybind="alt+ArrowRight" action={logAction("nav-next-timing-point")} />
    <FileMenuItem name="Previous Timing Point" keybind="alt+ArrowLeft" action={logAction("nav-prev-timing-point")} />
  </FileMenuItem>
  <FileMenuItem name="Playback">
    <FileMenuItem name="Play / Pause" keybind="Space" action={() => audio.toggle()} />
    <FileMenuItem name="Rate 100%" action={() => audio.playback.set(1)} />
    <FileMenuItem name="Rate 75%" action={() => audio.playback.set(.75)} />
    <FileMenuItem name="Rate 50%" action={() => audio.playback.set(.5)} />
    <FileMenuItem name="Rate 25%" action={() => audio.playback.set(.25)} />
  </FileMenuItem>
  <FileMenuItem name="Guides">
    <FileMenuItem name="New Guide" action={logAction("guide-new-guide")} />
    <FileMenuItem name="New Grid" action={logAction("guide-new-new-grid")} />
    <FileMenuItem name="Toggle Grids" keybind="ctrl+G" action={logAction("guide-toggle-grids")} />
    <FileMenuItem name="Toggle Guides" keybind="ctrl+shift+G" action={logAction("guide-toggle-guides")} />
  </FileMenuItem>
  <FileMenuItem name="Help">
    <FileMenuItem name="Documentation" keybind="F11" action={logAction("help-docs")} />
    <FileMenuItem name="What's New" action={logAction("help-whats-new")} />
    <FileMenuItem name="Search for Feature" action={logAction("help-search")} />
    <FileMenuItem name="About" action={logAction("help-about")} />
    <FileMenuItem name="Support owe.monster" action={openLink("https://www.patreon.com/osuwebedit")} />
    <FileMenuItem name="Discord" action={openLink("https://discord.gg/anbBhx3DNs")} />
    <FileMenuItem name="Credits" action={logAction("help-credits")} />
  </FileMenuItem>
  <OsuEditorUserMenu slot="end" />
</FileMenu>
