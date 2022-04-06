import axios from "axios";
import { BasicOWEProfile } from "./user-types";

export async function retrieveBasicInformation(accessToken: string) {
  return new Promise<any>((resolve, reject) => {

    requestInfo(accessToken).then(response => {
      let retrievedUser = response.data

      let requestedUserProfile: BasicOWEProfile = {
        Id: retrievedUser.id,
        AvatarUrl: retrievedUser.avatar_url,
        CountryCode: retrievedUser.country_code,
        Username: retrievedUser.username,
        CoverURL: retrievedUser.avatar_url,
        Playmode: retrievedUser.playmode,
        IsRestricted: retrievedUser.is_restricted,
        GlobalRank: retrievedUser.statistics.global_rank
      }

     resolve(requestedUserProfile);

    }).catch(err => {
      console.error(err);

      reject(undefined);
    })

  });
}

async function requestInfo(accessToken: string) {
  return axios.get("https://osu.ppy.sh/api/v2/me", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  })
}
