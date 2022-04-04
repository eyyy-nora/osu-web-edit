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

export function approachRateToMs(ar: number): [preempt: number, fadein: number] {
  return [
    1200 + (ar > 5 ? -150 * (ar - 5) : 120 * (5 - ar)),
    800 + (ar > 5 ? -100 * (ar - 5) : 80 * (5 - ar)),
  ];
}

export const BIT0 = 1;
export const BIT1 = 2;
export const BIT2 = 4;
export const BIT3 = 8;
export const BIT4 = 16;
export const BIT5 = 32;
export const BIT6 = 64;
export const BIT7 = 128;
