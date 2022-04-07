<script lang="ts">
import FileMenu from "../component/file-menu/FileMenu.svelte";
import FileMenuItem from "../component/file-menu/FileMenuItem.svelte";
import OsuEditorUserMenu from "./OsuEditorUserMenu.svelte";

function logAction(name: string) {
  return () => console.log(name);
}

</script>

<FileMenu>
  <FileMenuItem name="File">
    <FileMenuItem name="New" keybind="ctrl+N" action={logAction("new")} />
    <FileMenuItem name="Open..." keybind="ctrl+O" action={logAction("open")} />
    <FileMenuItem name="Import..." keybind="ctrl+shift+O" action={logAction("import")} />
    <FileMenuItem name="Save" keybind="ctrl+S" action={logAction("save")} />
    <FileMenuItem name="Save As..." keybind="ctrl+shift+S" action={logAction("save as")} />
    <FileMenuItem name="Export" action={logAction("export")} />
  </FileMenuItem>
  <FileMenuItem name="Edit">
    <FileMenuItem name="Undo" keybind="ctrl+Z" action={logAction("undo")} />
    <FileMenuItem name="Redo" keybind="ctrl+Y" action={logAction("redo")} />
    <FileMenuItem name="Copy" keybind="ctrl+C" action={logAction("copy")} />
    <FileMenuItem name="Cut" keybind="ctrl+X" action={logAction("cut")} />
    <FileMenuItem name="Paste" keybind="ctrl+V" action={logAction("paste")} />
    <FileMenuItem name="Delete" keybind="Delete" action={logAction("delete")} />
    <FileMenuItem name="Rotate Selection" keybind="ctrl+R" action={logAction("rotate")} />
    <FileMenuItem name="Scale Selection" keybind="ctrl+H" action={logAction("scale")} />
  </FileMenuItem>
  <FileMenuItem name="Insert">
    <FileMenuItem name="Circle" action={logAction("toggle grids")} />
    <FileMenuItem name="Slider" action={logAction("configure grids")} />
    <FileMenuItem name="Spinner" action={logAction("configure grids")} />
    <FileMenuItem name="Break" action={logAction("configure grids")} />
    <FileMenuItem name="Timing Point" action={logAction("configure grids")} />
    <FileMenuItem name="Polygon Notes" action={logAction("configure grids")} />
  </FileMenuItem>
  <FileMenuItem name="View">
  </FileMenuItem>
  <FileMenuItem name="Navigate">
    <FileMenuItem name="Next Tick" keybind="ArrowRight" action={logAction("next tick")} />
    <FileMenuItem name="Previous Tick" keybind="ArrowLeft" action={logAction("prev tick")} />
    <FileMenuItem name="Next Object" keybind="shift+ArrowRight" action={logAction("next object")} />
    <FileMenuItem name="Previous Object" keybind="shift+ArrowLeft" action={logAction("prev object")} />
    <FileMenuItem name="Next Bookmark" keybind="ctrl+ArrowRight" action={logAction("next bookmark")} />
    <FileMenuItem name="Previous Bookmark" keybind="ctrl+ArrowLeft" action={logAction("prev bookmark")} />
    <FileMenuItem name="Next Timing Point" keybind="alt+ArrowRight" action={logAction("next timing point")} />
    <FileMenuItem name="Previous Timing Point" keybind="alt+ArrowLeft" action={logAction("prev timing point")} />
  </FileMenuItem>
  <FileMenuItem name="Guides">
    <FileMenuItem name="New Guide" action={logAction("new guide")} />
    <FileMenuItem name="New Grid" action={logAction("new grid")} />
    <FileMenuItem name="Toggle Grids" keybind="ctrl+G" action={logAction("toggle grids")} />
    <FileMenuItem name="Toggle Guides" keybind="ctrl+shift+G" action={logAction("toggle guides")} />
  </FileMenuItem>
  <FileMenuItem name="Help">
    <FileMenuItem name="Documentation" keybind="F11" action={logAction("docs")} />
    <FileMenuItem name="What's New" action={logAction("whats new")} />
    <FileMenuItem name="Search for Feature" action={logAction("search")} />
    <FileMenuItem name="About" action={logAction("about")} />
    <FileMenuItem name="Support owe.monster" action={logAction("support")} />
  </FileMenuItem>
  <OsuEditorUserMenu slot="end" />
</FileMenu>
