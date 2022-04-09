import { Handler } from "@netlify/functions";
import { AxiosInstance } from "axios";
import { authorized } from "./oauth";
import { badRequest } from "./util";
import { fetchBeatmapMods } from "./osu/beatmap";

export const handler: Handler = async (event, context) => {
  const { id, scope } = event.queryStringParameters ?? {};

  if (requestLacksQueryArguments(id, scope))
    return badRequest("You have to provide at least 2 parameters (id, scope)!");

  const beatmapSetId = parseInt(id ?? "0");

  if (isNaN(beatmapSetId)) return badRequest("id is not a number!");

  const client = authorized(event);

  if (scope === "mods") {
    return {
      statusCode: 200,
      body: JSON.stringify(fetchBeatmapMods(beatmapSetId, client)) + JSON.stringify({ "id": id, "scope": scope })
    }
  } else return badRequest("Invalid or uninplemented scope!");
}

function requestLacksQueryArguments(id: any, scope: any) {
  return (id === undefined && scope === undefined);
}
