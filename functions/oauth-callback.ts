import { Handler } from "@netlify/functions";

const clientId = process.env.OSU_CLIENT_ID;
const token = process.env.OSU_SECRET;

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `OSU_CLIENT_ID:${clientId}, OSU_SECRET:${token}` }),
  }
}
