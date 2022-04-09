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


export type Discussion = {
  id: number;
  beatmapset_id: number;
  beatmap_id: number;
  user_id: number;
  message_type: string;
  parent_id: number;
  resolved: boolean;
  can_grant_kudosu: boolean;
  created_at: string;
  updated_at: string;
  last_post_at: string;
  starting_post: {};
}
