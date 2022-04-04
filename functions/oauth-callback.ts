import { Handler } from "@netlify/functions";

const clientId = process.env.OSU_CLIENT_ID;
const token = process.env.OSU_SECRET;

export const oAuthHandler: Handler = async (event, context) => {
  let code = (event.queryStringParameters === null) ? "" : event.queryStringParameters.code;
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Your osu! OAuthCode is = ${code}` }),
  }
}
