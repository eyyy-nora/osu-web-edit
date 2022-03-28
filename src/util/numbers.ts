export function clamp(value: number, min: number = 0, max: number = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function floorToMultiple(value: number, divisor: number, offset = 0) {
  let rest = (value - offset) % divisor;
  if (divisor - rest < .0001) rest = -divisor + rest;
  return round(value - rest);
}
