export function regExpEscape(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function allMatches(source: string, search: string | RegExp): (RegExpMatchArray & string[])[] {
  if (typeof search === "string") search = new RegExp(regExpEscape(search), "g");
  const matches: RegExpMatchArray[] = [];
  let group: RegExpMatchArray | null = null;
  while (group = search.exec(source)) matches.push(group);
  return matches;
}
