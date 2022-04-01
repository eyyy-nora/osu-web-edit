import { calculateStarRating } from "./calculator/index";

export function computeStarRating(rawBeatmap: string) {
  return parseFloat(calculateStarRating(rawBeatmap)["nomod"].toFixed(2));
}
