export const firstFiveAsNumber = (part: string, index: number) => index <= 4 ? +part : part;
export const firstFourAsNumber = (part: string, index: number) => index <= 3 ? +part : part;

export function camel(key: string): string {
  if (/^[A-Z]{2,}/.test(key)) return key.replace(/^([A-Z]+)([A-Z].*)$/, (_, first, rest) => {
    return first.toLowerCase() + rest;
  });
  return key[0].toLowerCase() + key.slice(1);
}
