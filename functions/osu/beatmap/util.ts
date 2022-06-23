import { AxiosInstance } from "axios";

export function createThreadObject(discussion: any) {
  const threadObject = discussion;

  threadObject["posts"] = new Array<{}>();
  threadObject["engaged_users"] = new Array<{}>();

  return threadObject;
}

export function getBeatmapScopes() {
  return {
    graveyard: new Array<any>(),
    pending: new Array<any>(),
    ranked: new Array<any>(),
    loved: new Array<any>()
  };
}



export async function retrieveDiscussions(mapsetId: number, client: AxiosInstance) {
  const { data: { discussions = [] } } = await client.get(`/beatmapsets/discussions?beatmapset_id=${mapsetId}`);

  return discussions;
}

export async function retrievePostsAndUsersFromDiscussion(discussionId: number, client: AxiosInstance) {
  const { data: {
    posts = [],
    users = []
  } } = await client.get(`/beatmapsets/discussions/posts?beatmapset_discussion_id=${discussionId}`);

  return { posts, users };
}

export async function retrieveCurrentUser(client: AxiosInstance) {
  return await client.get("/api/v2/me");
}

export async function retrieveEveryBeatmapFromUser(userId: number, status: string, client: AxiosInstance) {
  return await client.get(`/users/${userId}/beatmapsets/${status}?limit=99999`);
}



export function discussionContainsPost(post: any, discussion: any): boolean {
  return (post.beatmapset_discussion_id === discussion.id);
}

export function isMessageOwner(user: any, post: any): boolean {
  return (user.id === post.user_id);
}

