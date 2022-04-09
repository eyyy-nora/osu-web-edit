import { ParsedPoint } from "../parse/types";

export function* range(n: number): Iterable<number> {
  for (let i = 0; i<n; i++) yield i;
}

export function* mapIterator(iterator, mapping) {
  for (let i of iterator) yield mapping(i);
}

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
  // prod((n - kRange[]) / (kRange[] + 1))
  return prod(Array.from(mapIterator(range(k), (x) => (n - x) / (x + 1))));
}

export function bernstein(i: number, n: number, t: number): number {
  return binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

export function intersect_slope(p1: ParsedPoint, n1: ParsedPoint, p2: ParsedPoint, n2: ParsedPoint, precision: Number) {
  let des = n1.x*n2.y - n1.y*n2.x;
  if(Math.abs(des) < precision) {
    return null;
  }

  return (n1.x*(p2.y - p1.y) - n1.y*(p2.x - p1.x)) / des;
}

export function rot90(v: ParsedPoint): ParsedPoint {
  return {
    x: -v.y,
    y:  v.x
  } as ParsedPoint;
}

export const BIT0 = 1;
export const BIT1 = 2;
export const BIT2 = 4;
export const BIT3 = 8;
export const BIT4 = 16;
export const BIT5 = 32;
export const BIT6 = 64;
export const BIT7 = 128;
