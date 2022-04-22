import { Handler } from "@netlify/functions";
import { authorized } from "./oauth";
import { fetchUserBeatmaps } from "./osu/beatmap";

export const handler: Handler = async (event, context) => {
  const nonApiClient = authorized.legacy(event);
  return {
    statusCode: 200,
    body: JSON.stringify(await fetchUserBeatmaps(nonApiClient))
  }
}
