export const borderColor = 0xffffff;
export const borderWidthFactor = 0.07142857142857142;
export const approachCircleColor = 0x888888;
export const approachCircleWidthFactor = 0.05;
export const spinnerOuterRadius = 3;
export const spinnerInnerRadius = 5;
export const sliderBorderColor = 0x555555;
export const sliderBodyColor = 0x222222;
export const sliderBallColor = 0x666666;
export const sliderBallWidthFactor = 0.2;

export function radiusForCs(cs: number) {
  return 54.4 - 4.48 * cs;
}
