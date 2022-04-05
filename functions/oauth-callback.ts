import { Handler } from "@netlify/functions";
import { cookie, windowClose } from "./util";
import { requestAccessToken } from "./oauth";

export const handler: Handler = async (event, context) => {
  const { code } = event.queryStringParameters ?? {};

  if (!code) return {
    statusCode: 400,
    body: JSON.stringify({ error: "Login aborted!" }),
  };

  const { token, expires } = await requestAccessToken(code);

  return {
    statusCode: 200,
    multiValueHeaders: {
      "Set-Cookie": [
        cookie("access_token", token, { expires }),
        cookie("authorization_code", code),
      ]
    },
    headers: { "Content-Type": "text/html" },
    body: windowClose("Login Successful"),
  }
}

