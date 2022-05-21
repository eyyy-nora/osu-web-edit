import { snowflake } from "src/util/snowflake";
import { writable } from "./writable";
import { Readable, Stores, Deriver, Destroyable } from "./types";




export function derived<S extends Stores, T>(
  stores: S,
  fn: Deriver<S, T>,
  initial?: T,
): Readable<T> & Destroyable {
  const { get, set, subscribe } = writable<T>(initial);

  let prevId = "";

  const handler = () => {
    const retVal = fn(stores.map(store => store.get()) as any);
    const id = prevId = snowflake();
    if (typeof retVal === "object" && "then" in retVal && typeof retVal.then === "function")
      retVal.then(value => {
        if (prevId === id) set(value);
      });
    else set(retVal as T);
  }

  const registered = stores.map(store => store.subscribe(handler));

  const destroy = () => {
    for (const handler of registered) handler();
  }

  handler();

  return { get, subscribe, destroy };
}
