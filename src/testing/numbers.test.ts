import { lerp, binomialCoefficient, bernstein } from "../util/numbers";

import lerpData from "./test_data/lerpData.json";
import binCoeffData from "./test_data/binCoeffData.json";
import bernsteinData from "./test_data/bernsteinData.json";


describe.each(lerpData)("lerp(%f, %f, %f)", (minVal, maxVal, percent, expected) => {
  test(`expected return: ${expected}`, () => {
    expect(parseFloat(lerp(minVal, maxVal, percent).toFixed(2))).toBe(expected);
  });
});

describe.each(binCoeffData)("binomialCoefficient(%i, %i)", (n, k, expected) => {
  test(`expected return: ${expected}`, () => {
    expect(binomialCoefficient(n, k)).toBe(expected);
  });
});

describe.each(bernsteinData)("bernstein(%f, %f, %f)", (i, n, t, expected) => {
  test(`expected return: ${expected}`, () => {
    expect(parseFloat(bernstein(i, n, t).toFixed(2))).toBe(expected);
  });
});
