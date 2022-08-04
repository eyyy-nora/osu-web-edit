import { MapsetStore } from "src/context";

export interface IssueTemplate {
  error: string;
  category: string;
  type: string;
}

export interface Issue extends IssueTemplate {
  message: string;
  time?: number;
  apply?(context: MapsetStore, aimodWindow?);
}
