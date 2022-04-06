import { Handler } from "@netlify/functions";
import { retrieveBasicInformation } from "./osu/user/user-actions";
import { getCookies } from "./util";

export const handler: Handler = async (event, context) => {
  const { action } = event.queryStringParameters ?? {};

  if (!action) return badRequestError("You must specify a action query parameter!");

  switch (action) {
    case "basic-info":
      let { access_token: token } = getCookies(event.headers.cookie);

      if (token != undefined) {
        let userInfo = await retrieveBasicInformation(token);

        return {
          statusCode: 200,
          body: JSON.stringify(userInfo)
        }

      } else return {
          statusCode: 500,
          body: JSON.stringify({ error: "access_token is undefined!" }),
      };
      break;

    default: return badRequestError("Invalid action!");
  }
}

function badRequestError(errorMessage: string) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: errorMessage })
  };
}
