

export function everyFrame(fn: FrameRequestCallback): () => void {
  const handler = (time) => {
    fn(time);
    id = requestAnimationFrame(handler)
  }
  let id = requestAnimationFrame(handler);
  return () => cancelAnimationFrame(id);
}
