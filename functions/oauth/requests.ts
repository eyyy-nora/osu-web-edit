import axios from "axios";
import { clientId, redirectUrl, secret } from "./osu-oauth-constants";
import { url } from "../util";

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

  return { token: data.access_token, expires: data.expires_in * 1000 };
}
