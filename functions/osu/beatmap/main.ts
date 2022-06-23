import { AxiosInstance } from "axios";
import {
  createThreadObject, discussionContainsPost, getBeatmapScopes,
  isMessageOwner, retrieveCurrentUser, retrieveDiscussions, retrieveEveryBeatmapFromUser,
  retrievePostsAndUsersFromDiscussion
} from "./util";

export async function fetchBeatmapMods(beatmapSetID: number, client: AxiosInstance) {
  const mapsetThreads = [];

  const mapsetDiscussions = await retrieveDiscussions(beatmapSetID, client);


  for (const discussion of mapsetDiscussions) {
    let thread = createThreadObject(discussion);

    let { posts, users } = await retrievePostsAndUsersFromDiscussion(discussion.id, client);

    for (const post of posts) {
      if (discussionContainsPost(post, discussion))
        thread.posts.push(post);


      for (const user of users) {
        if (isMessageOwner(user, post) && !thread.engaged_users.includes(user))
          thread.engaged_users.push(user);
      }

    }

    mapsetThreads.push(thread);
  }

  return mapsetThreads;
}

export async function fetchUserBeatmaps(client: AxiosInstance) {
  const possibleStatus = ['graveyard', 'pending', 'ranked', 'loved'];

  const beatmaps = getBeatmapScopes();

  const { data: { id } } = await retrieveCurrentUser(client);

  for (const status of possibleStatus) {
    const { data } = await retrieveEveryBeatmapFromUser(id, status, client);

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
