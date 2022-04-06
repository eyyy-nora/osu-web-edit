export interface MeResponse {
  basic?: {
    id: number;
    avatar: string;
    country: string;
    username: string;
    cover: string;
    mode: string;
    restricted: boolean;
    rank: number;
  };
}
