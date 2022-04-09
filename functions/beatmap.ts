import { Handler } from "@netlify/functions";
import { AxiosInstance } from "axios";
import { authorized } from "./oauth";
import { badRequest } from "./util";
import { fetchBeatmapMods } from "./osu/beatmap";

export const handler: Handler = async (event, context) => {
  const { id, scope = ["info", "mods"] } = event.multiValueQueryStringParameters ?? {};

  if (!id?.length) return badRequest("No beatmapset id given!");
  if (!scope.length) return badRequest("No scopes requested. available scopes are ['info', 'mods']!");

  const beatmapSetId = parseInt(id[0]);

  if (isNaN(beatmapSetId)) return badRequest("id is not a number!");

  const client = authorized(event);

  switch (scope[0]) {
    case "mods": return modsRequest(beatmapSetId, client);
    case "info": return badRequest("Uninplemented scope!");

    default: return badRequest("Invalid scope specified!");
  }
}

function modsRequest(beatmapSetId: number, client: AxiosInstance) {
  return {
    statusCode: 200,
    body: JSON.stringify(fetchBeatmapMods(beatmapSetId, client))
  }
}
