import { Event } from "@netlify/functions/dist/function/event";
import axios, { AxiosResponse } from "axios";
import { clientId, redirectUrl, secret } from "./osu-oauth-constants";
import { getCookies, url } from "../util";

const oauthBase = "https://osu.ppy.sh/oauth";

export function authorizeUrl(scopes: string[]) {
  return url(`${oauthBase}/authorize`, {
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: "code",
    scope: scopes.join(" "),
  });
}

export function accessTokenUrl(): string {
  return `${oauthBase}/token`;
}

export async function requestAccessToken(code: string): Promise<{ token: string; expires: number }> {
  const { data } = await axios.post(accessTokenUrl(), {
    client_id: clientId,
    client_secret: secret,
    redirect_uri: redirectUrl,
    code,
    grant_type: "authorization_code"
  });

  if (!data.access_token || !data.expires_in)
    throw Object.assign(new Error(`Invalid Access Token Response`), data);

  return { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
}

export function authorized(event: Event, baseUrl?: string) {
  const { access_token } = getCookies(event.headers.cookie);
  if (!access_token) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return axios.create({
    baseURL: baseUrl ?? "https://osu.ppy.sh/api/v2",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}

export function mapResponse(map: Record<string, string>) {
  return function (response: AxiosResponse) {
    return Object.fromEntries(Object.entries(response.data).map(([key, value]) => {
      if (key in map) key = map[key];
      return [key, value];
    }));
  }
}
