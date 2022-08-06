import { OwoId } from "src/icons";

export function iconForIssue(issue: string) {
  let icon: OwoId;

  switch (issue) {
    case "Object concurrency":
      icon = "osu-ring";
      break;

    case "Background not present":
      icon = "alt";
      break;

    default:
      icon = "osu-ring";
  }

  return icon;
}
