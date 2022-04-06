import { Handler } from "@netlify/functions";
import { cookie } from "./util";

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    multiValueHeaders: {
      "Set-Cookie": [
        cookie("access_token", "", { expires: 0 }),
        cookie("authorization_code", "", { expires: 0 }),
      ]
    },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Logout successful" }),
  };
}
