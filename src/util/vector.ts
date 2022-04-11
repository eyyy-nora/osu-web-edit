
export function vecAdd(vec1: number[], vec2: number[]): number[] {
  return vec1.map((v, i) => v + vec2[i]);
}

export function vecSub(vec1: number[], vec2: number[]): number[] {
  return vec1.map((v, i) => v - vec2[i]);
}

export function vecMulVal(vec1: number[], x: number): number[] {
  return vec1.map((v, i) => v * x);
}

export function vecMulVec(vec1: number[], vec2: number[]): number[] {
  return vec1.map((v, i) => v * vec2[i]);
}

export function vecDivVal(vec1: number[], x: number): number[] {
  return vec1.map((v, i) => v / x);
}

export function vecDivVec(vec1: number[], vec2: number[]): number[] {
  return vec1.map((v, i) => v / vec2[i]);
}

export function vecPowVal(vec1: number[], x: number): number[] {
  return vec1.map((v, i) => v ** x);
}

export function vecPowVec(vec1: number[], vec2: number[]): number[] {
  return vec1.map((v, i) => v ** vec2[i]);
}

export function vecDiff(values: number[]): number[] {
  return vecSub(
    values.slice(1, values.length), 
    values.slice(0, values.length - 1)
  );
}

export function vecProd(values: number[]): number {
  return values.reduce((a, b) => a * b, 1);
}

export function vecSum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function vec2DLen(x: number[], y: number[]): number {
    // Σ √((Δx)^2 + (Δy)^2)
    return vecSum(vecPowVal(vecAdd(vecPowVal(vecDiff(x), 2), vecPowVal(vecDiff(y), 2)), 1/2));
}

export function xyCol(value2D: number[][], col: number): number[] {
  return value2D.map(values => values[col]);
}
