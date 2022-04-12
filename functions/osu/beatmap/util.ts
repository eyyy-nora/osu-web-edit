export function createDiscussionObject(discussion: any) {
  const {
    id, beatmap_id, user_id, message_type,
    resolved, can_grant_kudosu, created_at, updated_at,
    last_post_at, starting_post
  } = discussion;

  return {
    "id": id,
    "beatmap_id": beatmap_id,
    "user_id": user_id,
    "message_type": message_type,
    "resolved": resolved,
    "can_grant_kudosu": can_grant_kudosu,
    "created_at": created_at,
    "updated_at": updated_at,
    "last_post_at": last_post_at,
    "starting_post": starting_post,

    "posts": new Array<{}>(),
    "engaged_users": new Array<{}>()
  }
}

export function getBeatmapScopes() {
  return {
    graveyard: new Array<any>(),
    pending: new Array<any>(),
    ranked: new Array<any>(),
    loved: new Array<any>()
  };
}

export function discussionContainsPost(post: any, discussion: any): boolean {
  return (post.beatmapset_discussion_id === discussion.id);
}

export function isMessageOwner(user: any, post: any): boolean {
  return (user.id === post.user_id);
}

