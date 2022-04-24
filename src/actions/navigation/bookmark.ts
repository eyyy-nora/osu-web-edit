import { contextAction } from "../actions";
import { MapsetStore } from "src/context";



export function nextBookmark(context: MapsetStore) {
  const time = context.time.get();
  const bookmarks = context.beatmap.get()?.editor.bookmarks ?? [];
  if (!bookmarks.length) return;
  const next = bookmarks.find(it => it > time);
  if (next == undefined) return;
  context.goto(next);
}

export function prevBookmark(context: MapsetStore) {
  const time = context.time.get();
  const bookmarks = context.beatmap.get()?.editor.bookmarks ?? [];
  if (!bookmarks.length) return;
  const prev = bookmarks.slice().reverse().find(it => it < time);
  if (prev == undefined) return;
  context.goto(prev);
}

contextAction("nav-prev-bookmark", prevBookmark, "mapset");
contextAction("nav-next-bookmark", nextBookmark, "mapset");
