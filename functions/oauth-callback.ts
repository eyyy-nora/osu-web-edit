import { Handler } from "@netlify/functions";
import { exchangeForOAuth } from "./oauth/main";

export const handler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;

  if (code === undefined) return {
    statusCode: 400,
    body: JSON.stringify(`{ error: "Bad Request: code should not be undefined" }`)
  }

  let response = await exchangeForOAuth(code);

  if (response.message === undefined) {
    let date = new Date();
    date.setDate(date.getDate() + 1)

    let authorization_code = code;
    code = "finished";

    return {
      statusCode: 302,
      multiValueHeaders: {
        "Set-Cookie": [
          `access_token=${response.AccessToken}; Expires=${date.toUTCString()}; Path=/; Secure; HttpOnly;`,
          `authorization_code=${authorization_code}; Path=/; Secure; HttpOnly;`
        ],
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
