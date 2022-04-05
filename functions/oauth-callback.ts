import { Handler } from "@netlify/functions";
import { exchangeForOAuth, OAuthCookieTemplate } from "../oauth/main";

export const handler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;

  if (code === undefined) return {
    statusCode: 500,
    body: JSON.stringify(`{ error: "Internal Server Error" }`)
  }

  let response = await exchangeForOAuth("undefined");

  if (!isInvalid(response)) {
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

function isInvalid(response: OAuthCookieTemplate): boolean {
  return (
    response.AccessToken === undefined && response.ExpireIn === undefined &&
    response.AccessToken === "undefined" && response.ExpireIn === "undefined"
  )
}
