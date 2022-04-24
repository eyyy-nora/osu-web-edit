import { vecProd } from "./vector";


export function* range(n: number): Iterable<number> {
  for (let i = 0; i<n; i++) yield i;
}

export function* mapIterator(iterator: Iterable<any>, mapping: (arg: any) => any): Iterable<any> {
  for (let i of iterator) yield mapping(i);
}

export function clamp(value: number, min: number = 0, max: number = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function floorToMultiple(value: number, divisor: number, offset = 0) {
  value -= offset;
  const middle = Math.floor(value / divisor) * divisor;
  const high = middle + divisor;
  const low = middle - divisor;
  const diffMiddle = Math.abs(value - middle);
  if (diffMiddle > Math.abs(value - high)) return high + offset;
  if (diffMiddle > Math.abs(value - low)) return low + offset;
  return middle + offset;
}

export function approachRateToMs(ar: number): [preempt: number, fadein: number] {
  return [
    1200 + (ar > 5 ? -150 * (ar - 5) : 120 * (5 - ar)),
    800 + (ar > 5 ? -100 * (ar - 5) : 80 * (5 - ar)),
  ];
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
  // prod((n - kRange[]) / (kRange[] + 1))
  return vecProd(Array.from(mapIterator(range(k), (x) => (n - x) / (x + 1))));
}

export function bernstein(i: number, n: number, t: number): number {
  return binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

export function intersect_slope(p1: number[], n1: number[], p2: number[], n2: number[], precision: Number) {
  let des = n1[0]*n2[1] - n1[1]*n2[0];
  if(Math.abs(des) < precision) {
    return null;
  }

  return (n1[0]*(p2[1] - p1[1]) - n1[1]*(p2[0] - p1[0])) / des;
}

export function rot90(xy: number[]): number[] {
  return [-xy[1], xy[0]];
}

export const BIT0 = 1;
export const BIT1 = 2;
export const BIT2 = 4;
export const BIT3 = 8;
export const BIT4 = 16;
export const BIT5 = 32;
export const BIT6 = 64;
export const BIT7 = 128;
