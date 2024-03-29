import { MapsetStore } from "src/context";

export interface IssueTemplate {
  error: string;
  category: string;
  type: string;
}

export interface Issue extends IssueTemplate {
  message: string;
  time?: number;
  buttonMessage?: string;
  apply?(context: MapsetStore, aimodWindow?);
}
