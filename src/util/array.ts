export function isEmpty(array: any[]) {
  return (array.length <= 0);
}

export function weAreInTheEndOfTheArray(currentPosition: number, array: any[]) {
  const endOfTheArray = (array.length - 1);
  return currentPosition === endOfTheArray;
}
