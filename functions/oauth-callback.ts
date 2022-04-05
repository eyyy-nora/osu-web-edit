import { Handler } from "@netlify/functions";
import { exchangeForOAuth, OAuthCookieTemplate } from "../oauth/main";

export const handler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;

  if (code === undefined) return {
    statusCode: 400,
    body: JSON.stringify(`{ error: "Bad Request" }`)
  }

  let response = await exchangeForOAuth(code);

  if (response.message === undefined) {
    return {
      statusCode: 302,

      multiValueHeaders: {
        "Set-Cookie": [
          `access_token=${response.AccessToken}; Secure; HttpOnly`,
          `osu_authorization=${code}; Secure; HttpOnly`,
        ]
      },

      headers: {
        "Location": "/",
      }
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(`{ errorMessage: ${response.message} }`)
    }
  }
}
