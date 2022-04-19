import { Beatmap } from "./beatmap";

export interface Mapset {
  mapsetId?: number;
  creator?: string;

  beatmaps: Beatmap[];

  files: {
    [filename: string]: () => Promise<Blob>;
  };
}
