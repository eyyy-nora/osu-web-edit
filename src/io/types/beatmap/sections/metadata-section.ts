export interface BeatmapMetadataSection {
  title: string;
  titleUnicode: string;
  artist: string;
  artistUnicode: string;
  creator: string;
  version: string;
  source: string;
  tags: string[];
  beatmapID?: number;
  beatmapSetID?: number;
}
