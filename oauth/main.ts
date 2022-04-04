import axios from "axios";

require('dotenv').config();

const clientId = process.env.OSU_CLIENT_ID;
const token = process.env.OSU_SECRET;

export async function exchangeForOAuth(code: string) {
  let params = {
    "client_id": clientId,
    "client_secret": token,
    "code": code,
    "grant_type":"authorization_code",
    "redirect_uri": "https://owe.monster/.netlify/functions/oauth-callback"
  }

  return axios.post("https://osu.ppy.sh/oauth/token", params)
}
