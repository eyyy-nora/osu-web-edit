

export function everyFrame(fn: FrameRequestCallback): () => void {
  const handler = (time) => {
    fn(time);
    id = requestAnimationFrame(handler)
  }
  let id = requestAnimationFrame(handler);
  return () => cancelAnimationFrame(id);
}


export function debuffer<FN extends (...args: unknown[]) => void>(fn: FN, ms = 200): FN {
  let timeoutId = undefined;
  return function(...args: unknown[]) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    timeoutId = setTimeout(fn.bind(this, ...args), ms);
  } as FN;
}
