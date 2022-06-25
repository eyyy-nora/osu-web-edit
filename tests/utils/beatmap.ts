import { Beatmap } from "../../src/io/types/beatmap/beatmap";
import { parseOsuFile } from "../../src/io/parser/file";
import fs from "fs";

export async function getBeatmap(beatmapName: string): Promise<Beatmap> {
  const beatmapFileBuffer = fs.readFileSync(__dirname + `/assets/${beatmapName}.osu`);

  return await parseOsuFile(beatmapFileBuffer.toString());
}
