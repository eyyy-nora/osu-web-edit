import { Handler } from "@netlify/functions";
import { authorized } from "./oauth";
import { badRequest } from "./util";
import { fetchBeatmapMods, fetchUserBeatmaps } from "./osu/beatmap";
import { Event } from "@netlify/functions/dist/function/event";

export const handler: Handler = async (event, context) => {
  const { id, scope } = event.queryStringParameters ?? {};

  if (requestLacksQueryArguments(event))
    return badRequest("You have to provide at least 1 parameter (scope)!");


  const client = authorized(event);

  if (scope === "mods") {
    const beatmapSetId = parseInt(id ?? "0");
    if (isNaN(beatmapSetId)) return badRequest("id is not a number!");

    return {
      statusCode: 200,
      body: JSON.stringify(await fetchBeatmapMods(beatmapSetId, client))
    }
  } else if (scope === "all") {
    const nonApiClient = authorized(event, "https://osu.ppy.sh");

    return {
      statusCode: 200,
      body: JSON.stringify(await fetchUserBeatmaps(nonApiClient))
    }

  } else return badRequest("Invalid or uninplemented scope!");
}

function requestLacksQueryArguments(event: Event) {
  const { scope } = event.queryStringParameters ?? {};

  return (scope === undefined);
}
