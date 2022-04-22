import { Handler } from "@netlify/functions";
import { authorized } from "./oauth";
import { badRequest, params } from "./util";
import { fetchBeatmapMods } from "./osu/beatmap";

export const handler: Handler = async (event, context) => {
  let data;

  try {
    const { id } = params({ id: "number" }, event);
    const client = authorized(event);
    data = await fetchBeatmapMods(id, client);
  } catch (e: any) {
    return badRequest(e.message);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
