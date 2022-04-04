import { Handler } from "@netlify/functions";
import { exchangeForOAuth } from "../oauth/main";

export const handler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;

  if (code === undefined) return {
    statusCode: 500,
    body: JSON.stringify(`{ error: "Internal Server Error" }`)
  }

  let response = await exchangeForOAuth(code);

  if (response.data != undefined) {
    return {
      statusCode: 302,
      headers: {
        "Location": `/${response.data.acess_token}`
      }
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(`{ error: "Internal Server Error" }`)
    }
  }
}
