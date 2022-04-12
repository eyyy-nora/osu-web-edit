import { Handler } from "@netlify/functions";
import { authorized } from "./oauth";
import { badRequest } from "./util";
import { fetchBeatmapMods, fetchUserBeatmaps } from "./osu/beatmap";
import { Event } from "@netlify/functions/dist/function/event";

export const handler: Handler = async (event, context) => {
  const { id, scope } = event.queryStringParameters ?? {};

  if (requestLacksQueryArguments(event))
    return badRequest("You have to provide at least 2 parameters (id, scope)!");

  const beatmapSetId = parseInt(id ?? "0");

  if (isNaN(beatmapSetId)) return badRequest("id is not a number!");

  const client = authorized(event);
  const nonApiClient = authorized(event, "https://osu.ppy.sh");

  switch (scope) {
    case "mods": return {
      statusCode: 200,
      body: JSON.stringify(await fetchBeatmapMods(beatmapSetId, client))
    }

    case "all-mine": return {
      statusCode: 200,
      body: JSON.stringify(await fetchUserBeatmaps(nonApiClient))
    }

    default: return badRequest("Invalid or uninplemented scope!");
  }
}

function requestLacksQueryArguments(event: Event) {
  const { id, scope } = event.queryStringParameters ?? {};

  return (id === undefined && scope === undefined);
}
