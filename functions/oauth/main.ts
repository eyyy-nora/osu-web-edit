import axios from "axios";

const clientId = process.env.OSU_CLIENT_ID;
const token = process.env.OSU_SECRET;

export async function exchangeForOAuth(code: string) {
  return new Promise<OAuthCookie>((resolve, reject) => {
    requestOAuth(code).then(request => {

      if (isFullfilled(request)) {
        resolve({
          AccessToken: request.data.access_token,
        } as OAuthCookie)
      } else {
        reject({ message: "Could not retrieve data" } as OAuthCookie);
      }

    }).catch(err => {
      reject({message: `${err}`} as OAuthCookie);
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

function isFullfilled(request: any): boolean {
  return request.data.access_token != undefined && request.data.expires_in != undefined
}

export type OAuthCookie = {
  AccessToken?: string;
  message?: string;
}
