import { Handler } from "@netlify/functions";

const clientId = process.env.OSU_CLIENT_ID;
const token = process.env.OSU_SECRET;

export const handler: Handler = async (event, context) => {
  let code = event.queryStringParameters;

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `queryString parameters = ${code}` }),
  }
}
