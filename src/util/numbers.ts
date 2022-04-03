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

export function prod(values: number[]): number {
  return values.reduce((a, b) => a*b, 1);
}

export function lerp(low: number, high: number, percent: number): number {
  return low*(1.0 - percent) + high*percent;
}

export function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;

  // Take advantage of geometry
  k = Math.min(k, n - k);

  // [0 ... k]
  let k_range = Array.from(Array(k).keys());

  // prod((n - k_range[]) / (k_range[] + 1))
  return prod(k_range.map((x) => (n - x) / (x + 1)));
}

export function bernstein(i, n, t): number {
  return binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}


export const BIT0 = 1;
export const BIT1 = 2;
export const BIT2 = 4;
export const BIT3 = 8;
export const BIT4 = 16;
export const BIT5 = 32;
export const BIT6 = 64;
export const BIT7 = 128;
