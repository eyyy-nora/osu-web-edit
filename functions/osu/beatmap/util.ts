export function createDiscussionObject(discussion: any) {
  const oweDiscussionObject = discussion;

  oweDiscussionObject["posts"] = new Array<{}>();
  oweDiscussionObject["engaged_users"] = new Array<{}>();

  return oweDiscussionObject;
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

