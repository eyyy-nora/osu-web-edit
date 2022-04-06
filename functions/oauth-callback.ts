import { Handler } from "@netlify/functions";
import { exchangeForOAuth } from "./oauth/main";

export const handler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;

  if (code === undefined) return {
    statusCode: 400,
    body: JSON.stringify(`{ errorMessage: "Bad Request: code should not be undefined" }`)
  }

  let response = await exchangeForOAuth(code);

  if (response.message === undefined) {
    let date = new Date();
    date.setDate(date.getDate() + 1)

    return {
      statusCode: 302,
      multiValueHeaders: {
        "Set-Cookie": [
          `access_token=${response.AccessToken}; Expires=${date.toUTCString()}; Path=/; Secure; HttpOnly;`,
          `authorization_code=${code}; Path=/; Secure; HttpOnly;`
        ],
      },

      headers: {
        "Content-Type": "text/html",
      },

      body: JSON.stringify(htmlClose())
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(`{ errorMessage: ${response.message} }`)
    }
  }
}

function htmlClose(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Login Successful</title>
        <script>window.close();</script>
      </head>
      <body>
      </body>
    </html>
  `
}
