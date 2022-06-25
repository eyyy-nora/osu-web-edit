import axios, { AxiosInstance } from "axios";

export function clientForTest(): AxiosInstance {
  return axios.create({
    baseURL: "https://osu.ppy.sh/api/v2",
    headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
  });
}

clientForTest.legacy = function () {
  return axios.create({
    baseURL: "https://osu.ppy.sh",
    headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
  });
}
