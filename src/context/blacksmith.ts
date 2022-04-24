import { Component, Engine, GameObject } from "black-engine";
import { getContext, onDestroy, setContext } from "svelte";



const BLACK = {};

export interface BlackContext {
  engine(): Promise<Engine>;
  stage(): GameObject;
  addChild(child: GameObject, index?: number): Promise<void>;
  addComponent(component: Component, index?: number): Promise<void>;
  add(...gameObjectsAndComponents: (GameObject | Component)[]): Promise<void>;
}

export function getBlack(): BlackContext {
  return getContext(BLACK);
}

export function provideBlack(engine: () => Promise<Engine>, stage: () => GameObject) {

  const enginePromise = engine();

  async function addChild(child: GameObject, index?: number): Promise<void> {
    onDestroy(() => stage().removeChild(child));
    await enginePromise;
    stage().addChildAt(child, index);
  }

  async function addComponent(component: Component, index?: number): Promise<void> {
    onDestroy(() => stage().removeComponent(component));
    await enginePromise;
    stage().addComponentAt(component, index);
  }

  async function add(...gameObjectsAndComponents: (GameObject | Component)[]): Promise<void> {
    onDestroy(() => {
      const s = stage();
      gameObjectsAndComponents.forEach(it => it instanceof GameObject ? s.removeChild(it) : s.removeComponent(it));
    });
    await enginePromise;
    stage().add(...gameObjectsAndComponents);
  }

  setContext<BlackContext>(BLACK, {
    engine: () => enginePromise,
    stage,
    addChild,
    addComponent,
    add,
  });
}

export function provideBlackContainer(stage: () => GameObject) {
  const { engine } = getBlack();
  provideBlack(engine, stage);
}

export function addBlackComponent(component: Component, index?: number) {
  getBlack().addComponent(component, index);
}

export function addBlackChild(child: GameObject, index?: number) {
  const stage = getBlack().stage();
  stage.addChildAt(child, index);
  onDestroy(() => stage.removeChild(child));
}

export function pushBlackStage(stage: GameObject, index?: number) {
  const { engine, addChild } = getBlack();
  addChild(stage, index);
  provideBlack(engine, () => stage);
}
