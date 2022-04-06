import { Handler } from "@netlify/functions";
import { exchangeForOAuth, OAuthCookieTemplate } from "./oauth/main";

export const handler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;

  if (code === undefined) return {
    statusCode: 400,
    body: JSON.stringify(`{ error: "Bad Request" }`)
  }

  let response = await exchangeForOAuth(code);

  if (response.message === undefined && response.ExpireIn != undefined) {
    let date = new Date();
    date.setTime(date.getTime() + response.ExpireIn);

    return {
      statusCode: 302,
      headers: {
        "Set-Cookie": `access_token=${response.AccessToken}; Expires=${date.toUTCString()}; Path=/; Secure; HttpOnly;`,
        "Location": "/connect",
      }
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(`{ errorMessage: ${response.message} }`)
    }
  }
}
