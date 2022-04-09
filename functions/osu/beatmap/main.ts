import { AxiosInstance } from "axios";
import { createDiscussionObject, discussionContainsPost, isMessageOwner } from "./util";

const BEATMAP_API_PATH = "/beatmapsets/discussions?beatmapset_id=";
const DISCUSSIONS_API_PATH = "/beatmapsets/discussions/posts?beatmapset_discussion_id=";

export async function fetchBeatmapMods(beatmapSetID: number, client: AxiosInstance) {
  const { data: { discussions = [] } } = await client.get(BEATMAP_API_PATH + beatmapSetID);

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


