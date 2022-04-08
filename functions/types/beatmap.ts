export interface BeatmapSetInfo {
  Id: number;
  Covers: Covers;
  FavouriteCount: number;
  Hype: number;
  PlayCount: number;
  // maybe we dont need the preview
  PreviewUrl: string;
  Nsfw: boolean;
  Status: string;
  CanBeHyped: boolean;
  DiscussionEnabled: boolean;
  DiscussionLocked: boolean;
  LastUpdated: string;
  NominationsSummary: NominationSummary;
  RankedDate: string;
  SubmittedDate: string;
  DownloadLink?: string;
}

export interface Covers {
  Cover: string;
  Cover2x: string;
  Card: string;
  Card2x: string;
  List: string;
  List2x: string;
  SlimCover: string;
  SlimCover2x: string;
}

export interface NominationSummary {
  Current: number;
  Required: number;
}


export interface Discussion {
  Id: number;
  BeatmapsetId: number;
  UserId: number;
  MessageType: string;
  ParentId?: number;
  Resolved: boolean;
  CanGrantKudosu: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  LastPostAt: string;
  CurrentUserAttributes: UserDiscussionAttributes;
  StartingPost: Post;
  Posts: Post[];
  EngagedUsers: DiscussionUser[];
}

export interface DiscussionUser {
  Id: number;
  Username: string;
  AvatarURL: string;
  CountryCode: string;
  IsBot: boolean;
  IsSupporter: boolean;
  IsOWEUser?: boolean;
}

export interface UserDiscussionAttributes {
  VoteScore: number;
  CanModerateKudosu: boolean;
  CanResolve: boolean;
  CanReopen: boolean;
  CanDestroy: boolean;
}

export interface Post {
  BeatmapsetDiscussionId: number;
  CreatedAt: string;
  Message: string;
  System: boolean;
  UpdatedAt: string;
  UserId: number;
}
