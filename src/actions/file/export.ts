import { actions } from "../actions";



actions.registerAction("file-export", {
  async run(params, { mapset }) {
    await mapset.downloadMapset();
  }
}, ["mapset"]);
