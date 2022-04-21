import { createStore } from "@propero/easy-store";
import { Writable, Subscriber, Unsubscriber, Invalidator } from "./types";


export function writable<T>(initial?: T): Writable<T> & { get(): T } {
  const { sub, unsub, update, setValue: set, getValue: get } = createStore(initial);

  function subscribe(run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber {
    run(get());
    sub(run);
    return () => {
      unsub(run);
      invalidate(get());
    };
  }

  return { update, set, get, subscribe };
}
