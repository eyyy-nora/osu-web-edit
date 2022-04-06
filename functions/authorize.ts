import { Handler } from "@netlify/functions";
import { authorizeUrl, requestAccessToken } from "./oauth";
import { cookie, getCookies, redirect, windowClose } from "./util";

export const handler: Handler = async (event, context) => {
  const { authorization_code: code } = getCookies(event.headers.cookie);
  if (code) try {
    const  { token, expires } = await requestAccessToken(code);
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
    };
  } catch {}
  return redirect(authorizeUrl(["public", "identify"]));
}
