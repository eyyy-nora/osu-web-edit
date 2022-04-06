import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 301,
    headers: {
      "Location": "https://osu.ppy.sh/oauth/authorize?client_id=13739&redirect_uri=https://owe.monster/.netlify/functions/oauth-callback&response_type=code&scope=public identify"
    }
  }
}
