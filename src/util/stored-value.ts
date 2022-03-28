import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

interface SerializedStore {
  has(key: string): boolean;
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  keys(): string[];
  refresh(): void;
}

export function serializedStore(store: Storage): SerializedStore {
  let cache: Record<string, unknown> = {};

  function parse(value: string): unknown {
    if (value === null) return undefined;
    try {
      return JSON.parse(value, (key, value) => {
        if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value)) return new Date(value);
        return value;
      });
    } catch {
      return value;
    }
  }

  function serialize(value: unknown): string {
    return JSON.stringify(value);
  }

  function has(key: string): boolean {
    if (cache[key] !== undefined) return true;
    return store.getItem(key) !== undefined;
  }

  function get(key: string): unknown {
    return cache[key] ?? (cache[key] = parse(store.getItem(key)));
  }

  function set(key: string, value: unknown): void {
    store.setItem(key, serialize(cache[key] = value));
  }

  function keys(): string[] {
    const results: string[] = Array(store.length);
    for (let i = 0; i < store.length; ++i)
      results[i] = store.key(i);
    return results;
  }

  function refresh(): void {
    cache = {};
  }

  return { has, get, set, keys, refresh };
}

export function storedValue<T>(storage: SerializedStore, key: string, fallback: T | (() => T)): Writable<T> {
  if (typeof fallback !== "function") fallback = () => fallback as T;
  const initial = storage.has(key) ? storage.get(key) as T : (fallback as () => T)();
  const store = writable(initial);
  store.subscribe((value) => {
    if (value !== (fallback as () => T)())
      storage.set(key, value);
  });
  return store;
}
