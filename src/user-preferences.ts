import { serializedStore } from "./util/stored-value";

export const local = serializedStore(localStorage);
export const session = serializedStore(sessionStorage);

export const GIRDER_LEFT_WIDTH = "girder-left-width";
export const GIRDER_RIGHT_WIDTH = "girder-right-width";
