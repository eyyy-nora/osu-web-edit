import { actions } from "src/actions";
import { withFileDialog } from "src/util/open-file-dialog";



actions.registerAction("file-import", {
  async run({ file, beatmapId, mapsetId }, { mapset }) {
    if (file ?? mapsetId)
      await mapset.loadMapset(file ?? `https://api.chimu.moe/v1/download/${mapsetId}`, beatmapId);
    else await withFileDialog(mapset.loadMapset);
  }
}, ["mapset"]);
