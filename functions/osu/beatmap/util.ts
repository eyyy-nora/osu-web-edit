import { Discussion } from "../../types";

export function createDiscussionObject(discussion: Discussion) {
  return {
    "id": discussion.id,
    "beatmap_id": discussion.beatmap_id,
    "user_id": discussion.user_id,
    "message_type": discussion.message_type,
    "resolved": discussion.resolved,
    "can_grant_kudosu": discussion.can_grant_kudosu,
    "created_at": discussion.created_at,
    "updated_at": discussion.updated_at,
    "last_post_at": discussion.last_post_at,
    "starting_post": discussion.starting_post,

    "posts": new Array<{}>(),
    "engaged_users": new Array<{}>()
  }
}

export function discussionContainsPost(post: any, discussion: Discussion): boolean {
  return (post.beatmapset_discussion_id === discussion.id);
}

export function isMessageOwner(user: any, post: any): boolean {
  return (user.id === post.user_id);
}

