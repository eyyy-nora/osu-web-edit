import { Handler } from "@netlify/functions";
import { exchangeForOAuth, OAuthCookieTemplate } from "../oauth/main";

export const handler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;

  if (code === undefined) return {
    statusCode: 500,
    body: JSON.stringify(`{ error: "Internal Server Error" }`)
  }

  let response = await exchangeForOAuth(code);

  if (response.AccessToken != undefined && response.ExpireIn != undefined) {
    return {
      statusCode: 302,
      headers: {
        "Location": `/connect-to-osu?access_token=${response.AccessToken}&expires_in=${response.ExpireIn}`
      }
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(`{ message: ${response.message} }`)
    }
  }
}
