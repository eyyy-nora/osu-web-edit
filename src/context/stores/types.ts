
/** One or more `Readable`s. */
export type Stores = [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;
/** One or more values from `Readable` stores. */
export type StoreValues<T> = {
  [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
};

/** Callback to inform of a value updates. */
export type Subscriber<T> = (value: T) => void;
/** Unsubscribes from value updates. */
export type Unsubscriber = () => void;
/** Callback to update a value. */
export type Updater<T> = (value: T, before?: T) => T;
/** Cleanup logic callback. */
export type Invalidator<T> = (value?: T) => void;
/** Store value getter */
export type Getter<T> = () => T;
/** Store value setter */
export type Setter<T> = (value: T) => void;
/** Derives a value from given stores */
export type Deriver<S extends Stores, T> = (values: StoreValues<S>) => Promise<T> | T;


export interface Readable<T> {
  /**
   * Subscribe on value changes.
   * @param run subscription callback
   * @param invalidate cleanup callback
   */
  subscribe(run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber;

  /**
   * Get the currently held value of this store
   */
  get(): T;
}

export interface Writable<T> extends Readable<T> {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: T): void;
  /**
   * Update value using callback and inform subscribers.
   * @param updater callback
   */
  update(this: void, updater: Updater<T>): void;
}

export interface Destroyable {
  /**
   * unregisters handles, frees resources
   */
  destroy(): void;
}
