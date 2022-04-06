
export interface CookieOptions {
  httpOnly?: boolean;
  expires?: Date | number;
  secure?: boolean;
  path?: string;
}

export function nextMonth(): Date {
  const thirtyDays = 2592000000;
  return new Date(Date.now() + thirtyDays);
}

export function nextDay(): Date {
  const twentyFourHours = 86400000;
  return new Date(Date.now() + twentyFourHours);
}

export function cookie(name: string, value: any, options: CookieOptions = {}): string {
  let {
    httpOnly = true,
    expires = nextMonth(),
    secure = true,
    path = "/",
  } = options;

  if (typeof expires === "number") expires = new Date(expires);

  return `${name}=${value}; Expires=${expires.toUTCString()}; Path=${path}${secure ? "; Secure" : ""}${httpOnly ? "; HttpOnly" : ""}`;
}


export function getCookies(header = ""): Record<string, string> {
  if (!header.trim()) return {};
  const cookies: Record<string, string> = {};
  for (const full of header.split(";")) {
    const index = full.indexOf("=");
    cookies[full.slice(0, index).trim()] = full.slice(index + 1).trim();
  }
  return cookies;
}
