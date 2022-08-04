import { BeatmapObject } from "src/io"
import { Issue } from "./issue"

const composeIssue = (cfg: Partial<Issue> & { message: string; error: string; buttonMessage?: string }): Issue => ({
  category: "Compose",
  type: "Warning",
  ...cfg,
})



export function concurrencyIssue(hitObject: BeatmapObject, nextHitObject: BeatmapObject) {
  const { time } = hitObject;

  return composeIssue({
    error: "Object concurrency",
    message: `A ${hitObject.type} is concurrent to a ${nextHitObject.type}.`,
    buttonMessage: "Go to issue location",
    apply(context, aimodWindow) {
      aimodWindow.hide?.();
      context.goto(time);
    },
  });
}
