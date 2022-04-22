import { issueTemplater } from "./issue-template"
import { openFileDialog } from "src/util/open-file-dialog"

export function backgroundNotPresentIssue(): Object {
  // note: maybe the issue category could be Problem
  const issue = issueTemplater("background_not_present", "Resources", "Warning");

  issue["message"] = `The specified background was not found in the beatmap directory.`;
  issue["onclick"] = () => {
    // Open prompt to import image
    openFileDialog();
  }

  return issue;
}
