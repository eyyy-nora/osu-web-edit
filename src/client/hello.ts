import axios from "axios";

export async function hello(): Promise<{ message: string }> {
  const { data } = await axios.get("/.netlify/functions/hello");
  return data;
}
