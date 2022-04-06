import { Handler } from "@netlify/functions";
import { MeResponse } from "./types";
import { authorized, mapResponse } from "./oauth";
import { badRequest } from "./util";

export const handler: Handler = async (event, context) => {
  const { scope = ["basic"] } = event.multiValueQueryStringParameters ?? {};

  if (!scope.length) return badRequest("No scopes requested. available scopes are ['basic']!");

  const response: MeResponse = {};
  const client = authorized(event);

  if (scope.includes("basic")) {
    response.basic = await client.get("/me").then(mapResponse({
      avatar_url: "avatar", country_code: "country", cover_url: "cover",
      playmode: "mode", is_restricted: "restricted", global_rank: "rank"
    })) as any;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}
