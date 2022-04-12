import { Response } from "@netlify/functions/dist/function/response";


export function url(base: string, params: any): string {
  const query = Object.entries(params).map(([name, value]) => `${name}=${value}`).join("&");
  if (query) return `${base}?${query}`;
  return base;
}

export function redirect(url: string): Response {
  return {
    statusCode: 302,
    headers: { Location: url },
  };
}

export function badRequest(error: string) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error }),
  };
}
