import { Issue } from "./issue";
import { openFileDialog } from "src/util/open-file-dialog"

const resourcesIssue = (cfg: Partial<Issue> & { message: string; error: string; buttonMessage?: string }): Issue => ({
  category: "Resources",
  type: "Warning",
  ...cfg,
})

export function backgroundNotPresentIssue() {
  return resourcesIssue({
    message: "The specified background was not found in the beatmap directory.",
    error: "Background not present",
    buttonMessage: "Import a image",
    apply(context) {
      openFileDialog();
    }
  });
}
