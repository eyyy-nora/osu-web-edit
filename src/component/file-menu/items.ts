import type { OwoId } from "../../icons";

export interface FileMenuCategory {
  text: string;
  items: FileMenuItem[];
}

export interface FileMenuItem {
  text: string;
  icon?: OwoId;
  shortcut?: string;
}

export const items: FileMenuCategory[] = [{
  text: "File",
  items: [{
    text: "New",
    shortcut: "ctrl+n",
  }, {
    text: "Open...",
    shortcut: "ctrl+o",
  }, {
    text: "Import...",
    shortcut: "ctrl+shift+o",
  }, {
    text: "Save",
    shortcut: "ctrl+s",
  }, {
    text: "Export",
    shortcut: "ctrl+shift+s",
  }]
}]
