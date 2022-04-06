import axios from "axios";
import type { MeResponse } from "../../functions/types";

const client = axios.create({ baseURL: "/.netlify/functions" });

export async function login(): Promise<MeResponse> {
  return new Promise((resolve, reject) => {
    const loginTab = window.open("/.netlify/functions/authorize", "_blank");

    const checkId = setInterval(async () => {
      if (!loginTab.closed) return;
      clearInterval(checkId);
      clearTimeout(timeoutId);
      try {
        resolve(await me("basic"));
      } catch (e) {
        reject(e);
      }
    }, 100);

    const timeoutId = setTimeout(() => {
      clearInterval(checkId);
      reject(new Error("Login timed out!"));
    }, 60000);
  });
}

export async function logout(): Promise<void> {
  await client.get("/logout");
}

export async function me(...scopes: string[]): Promise<MeResponse> {
  const { data } = await client.get("/me", { params: { scopes } });
  return data;
}
