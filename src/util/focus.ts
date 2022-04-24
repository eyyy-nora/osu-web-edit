interface ElementWithTabOrder {
  el: HTMLElement;
  index: number;
  tabIndex: number;
}

type FocusFn = (options?: FocusOptions) => void;

const candidates = [
  'input:not([type="hidden"])',
  "select",
  "textarea",
  "a[href]",
  "button",
  "[tabindex]",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])',
];

const selector = candidates.map(selector => `${selector}:not([disabled]):not([tabindex="-1"])`).join(",");

function isVisible(node: HTMLElement, ignoreOffsetParent = false) {
  return (!ignoreOffsetParent && node.offsetParent != null) && getComputedStyle(node).visibility !== "hidden";
}

function cycle(bound: number, current: number, amount: number): number {
  const value = (current + amount) % bound;
  if (value < 0) return value + bound;
  return value;
}

function elementWithTabOrder(el: HTMLElement, index: number) {
  let tabIndex = +(el.getAttribute("tabindex") ?? "0");
  if (isNaN(tabIndex)) tabIndex = 0;
  return { el, index, tabIndex };
}

function sortByTabOrder(a: ElementWithTabOrder, b: ElementWithTabOrder): number {
  return a.tabIndex === b.tabIndex ? a.index - b.index : b.tabIndex - a.tabIndex;
}

function focusRestorer(): FocusFn {
  const current = document.activeElement as HTMLElement;
  return (options) => current?.focus?.(options);
}

export function getTabbable(container = document.body, ignoreOffsetParent = false) {
  return ([...container.querySelectorAll(selector)] as HTMLElement[])
    .filter(el => isVisible(el, ignoreOffsetParent))
    .map(elementWithTabOrder)
    .sort(sortByTabOrder)
    .map(({ el }) => el);
}


export function tabInto(
  el: HTMLElement,
  index = 0,
  options?: FocusOptions,
  ignoreOffsetParent?: boolean,
): FocusFn {
  const restore = focusRestorer();
  const elements = getTabbable(el, ignoreOffsetParent);
  if (!elements.length) return () => {};
  elements[cycle(elements.length, 0, index)]?.focus?.(options);
  return restore;
}

export function tabOutOf(
  el: HTMLElement,
  steps = 1,
  options?: FocusOptions,
  ignoreOffsetParent?: boolean,
): FocusFn {
  if (steps === 0) steps = 1;
  const inside = getTabbable(el, ignoreOffsetParent)
  const outside = getTabbable(undefined, ignoreOffsetParent);
  if (!inside.length || !outside.length) return () => {};
  const restore = focusRestorer();
  const firstIndex = outside.indexOf(inside[0]);
  const lastIndex = outside.lastIndexOf(inside[inside.length - 1]);
  const elements = [
    ...outside.slice(0, firstIndex),
    ...outside.slice(lastIndex),
  ];
  elements[cycle(elements.length, firstIndex, steps)]?.focus?.(options);
  return restore;
}

export function tab(
  steps = 1,
  container?: HTMLElement,
  options?: FocusOptions,
  ignoreOffsetParent?: boolean,
): FocusFn {
  const elements = getTabbable(container, ignoreOffsetParent);
  const current = document.activeElement;
  const index = elements.indexOf(current as HTMLElement);
  if (index === -1) return tabInto(container, 0, options, ignoreOffsetParent);
  const restore = focusRestorer();
  elements[cycle(elements.length, index, steps)]?.focus?.(options);
  return restore;
}
