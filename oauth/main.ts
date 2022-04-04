import axios from "axios";

require('dotenv').config();

const clientId = process.env.OSU_CLIENT_ID;
const token = process.env.OSU_SECRET;

export async function exchangeForOAuth(code: string) {
  return new Promise<OAuthCookieTemplate>((resolve, reject) => {
    requestOAuth(code).then(request => {
      if (request.data.access_token != undefined && request.data.expires_in != undefined) {
        resolve({
            "acess_token": request.data.access_token,
            "expires_in": request.data.expires_in,
          } as OAuthCookieTemplate)
      } else reject({"message": "things are undefined"} as OAuthCookieTemplate);
    }).catch(err => {
      reject({"message": err} as OAuthCookieTemplate);
    })
  })
}

async function requestOAuth(code: string) {
  let params = {
    "client_id": clientId,
    "client_secret": token,
    "code": code,
    "grant_type":"authorization_code",
    "redirect_uri": "https://owe.monster/.netlify/functions/oauth-callback"
  }

  return axios.post("https://osu.ppy.sh/oauth/token", params)
}

export type OAuthCookieTemplate = {
  AccessToken?: string;
  ExpireIn?: number;
  message?: string;
}
