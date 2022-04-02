import type { DisplayObject, Application, Container } from "pixi.js";
import { getContext, onDestroy, setContext } from "svelte";



export const PIXI_CONTEXT = {};



export interface PixiContext {
  app(): Application;

  stage(): Container;

  register(...objects: DisplayObject[]): void;
}



export function providePixi(app: () => Application, stage: () => Container) {
  setContext<PixiContext>(PIXI_CONTEXT, {
    app,
    stage,
    register(...objects) {
      stage().addChild(...objects);
      onDestroy(() => stage().removeChild(...objects));
    }
  });
}

export function registerPixi(...objects: DisplayObject[]): void {
  getContext<PixiContext>(PIXI_CONTEXT).register(...objects);
}



export interface StageTransform {
  x?: number,
  y?: number,
  scaleX?: number,
  scaleY?: number,
  rotation?: number,
  skewX?: number,
  skewY?: number,
  pivotX?: number,
  pivotY?: number
}
