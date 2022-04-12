import { AxiosInstance } from "axios";
import { BEATMAP_DISCUSSIONS_API_PATH, DISCUSSIONS_API_PATH } from "./constants";
import { createDiscussionObject, discussionContainsPost, getBeatmapScopes, isMessageOwner } from "./util";

export async function fetchBeatmapMods(beatmapSetID: number, client: AxiosInstance) {
  const { data: { discussions = [] } } = await client.get(BEATMAP_DISCUSSIONS_API_PATH + beatmapSetID);

  const beatmapsetThreads = [];

  for (const discussion of discussions) {
    let thread = createDiscussionObject(discussion);

    let { data: { posts = [], users = [] } } = await client.get(DISCUSSIONS_API_PATH + discussion.id);

    for (const post of posts) {
      if (discussionContainsPost(post, discussion))
        thread.posts.push(post);

      const engagedUsers = thread.engaged_users;

      for (const user of users) {
        if (isMessageOwner(user, post) && !engagedUsers.includes(user))
          engagedUsers.push(user);
      }
    }

    beatmapsetThreads.push(thread);
  }

  return beatmapsetThreads;
}

export async function fetchUserBeatmaps(client: AxiosInstance) {
  const { data: { id } } = await client.get("/api/v2/me");

  const possibleStatus = ['graveyard', 'pending', 'ranked', 'loved'];

  const beatmaps = getBeatmapScopes();

  for (const status of possibleStatus) {
    const { data } = await client.get(`/users/${id}/beatmapsets/${status}`);

    for (const map of data) {
      let { status, id } = map;
      map.download_url = `https://owe.monster/${id}`;

      switch (status) {
        case 'graveyard': beatmaps.graveyard.push(map);
          break;
        case 'pending': case 'wip': beatmaps.pending.push(map);
          break;
        case 'ranked': case 'qualified': case 'approved': beatmaps.ranked.push(map);
          break;
        case 'loved': beatmaps.loved.push(map);
          break;
      }
    }
  }

  return beatmaps;
}
