import { snowflake } from "src/util/snowflake";



export interface ActionRegistryPlugin {
  restore?(): Promise<ActionHistoryEntry[]>;
  persist?(entries: ActionHistoryEntry[]): Promise<void>;
}

export type Undoer = (
  params: Record<string, any>,
  context: Record<string, any>,
  issuedBy: string,
  restoreData: Record<string, any>,
) => Promise<{
  redo?: Redoer;
  restoreData: Record<string, any>;
}>;

export type Redoer = (
  params: Record<string, any>,
  context: Record<string, any>,
  issuedBy: string,
  restoreData: Record<string, any>,
) => Promise<{
  undo?: Undoer;
  restoreData: Record<string, any>;
}>;

export interface ActionHistoryEntry {
  id: string;
  name: string;
  undone: boolean;
  issuedBy: string;
  params: Record<string, any>;
  restoreData?: Record<string, any>;
  undo?: Undoer;
  redo?: Redoer;
}

export interface ActionRegistryParams {
  limit?: number;
  plugins?: ActionRegistryPlugin[];
}

export interface ActionDefinition {
  meta?: Record<string, any>;
  run(
    params: Record<string, any>,
    context: Record<string, any>,
    issuedBy: string
  ): Promise<{
    undo?: Undoer;
    restoreData?: Record<string, any>;
  } | void>
  undo?: Undoer;
  redo?: Redoer;
}

export interface ActionRegistry {
  run(
    action: string,
    params: Record<string, any>,
    issuer: string,
  ): Promise<void>;
  registerAction(
    name: string,
    action: ActionDefinition,
    requiredContexts?: string[],
  ): void;
  registerContext(
    name: string,
    context: any,
  ): void;
  undo(
    issuer: string,
  ): Promise<void>;
  redo(
    issuer: string,
  ): Promise<void>;
  hasAction(name: string): boolean;
  hasContext(name: string): boolean;
  waitForAction(name: string): Promise<ActionDefinition>;
  waitForContext(name: string): Promise<any>;
  getAction(name: string): ActionDefinition;
  getContext(name: string): any;
}

export function createActionRegistry({
  plugins = [],
  limit = 10000,
}: ActionRegistryParams = {}): ActionRegistry {

  const actions: Record<string, ActionDefinition> = {};
  const actionResolvers: Record<string, (action: ActionDefinition) => void> = {};
  const actionPromises: Record<string, Promise<ActionDefinition>> = {};
  const actionDependencies: Record<string, string[]> = {};

  const contexts: Record<string, any> = {};
  const contextResolvers: Record<string, (context: any) => void> = {};
  const contextPromises: Record<string, Promise<ActionDefinition>> = {};

  const hasAction = (name: string) => name in actions;
  const hasContext = (name: string) => name in contexts;

  const getAction = (name: string) => actions[name];
  const getContext = (name: string) => contexts[name];

  const waitForAction = (name: string) => {
    if (hasAction(name)) return Promise
      .all(actionDependencies[name].map(waitForContext))
      .then(() => actions[name]);
    return actionPromises[name] ??= new Promise(resolve => actionResolvers[name] = resolve)
      .then(() => waitForAction(name));
  }

  const waitForContext = (name: string) => {
    if (hasContext(name)) return Promise.resolve(contexts[name]);
    return contextPromises[name] ??= new Promise(resolve => contextResolvers[name] = resolve);
  }

  const registerAction = (name: string, action: ActionDefinition, required: string[] = []) => {
    actions[name] = action;
    actionDependencies[name] = required;
    if (actionResolvers[name]) {
      actionResolvers[name](action);
      delete actionResolvers[name];
      delete actionPromises[name];
    }
  }

  const registerContext = (name: string, context: any) => {
    contexts[name] = context;
    if (contextResolvers[name]) {
      contextResolvers[name](context);
      delete contextResolvers[name];
      delete contextPromises[name];
    }
  }

  let history: ActionHistoryEntry[] = [];
  let restoring: Promise<void> | undefined;

  function pushHistory(entry: ActionHistoryEntry): void {
    history.push(entry);
    while (history.length > limit) history.shift();
  }

  const run = async (action: string, params: Record<string, any>, issuer: string) => {
    const definition = await waitForAction(action);
    const { undo, restoreData } = await definition.run(params, contexts, issuer) ?? {};
    if (!undo || !definition.undo) return; // non-undoable action
    pushHistory({
      id: snowflake(),
      name: action,
      params,
      restoreData,
      issuedBy: issuer,
      undone: false,
      undo,
    });
  };

  const undo = async (issuer: string) => {
    const entry = history.slice().reverse().find((entry) => {
      if (entry.undone) return false;
      return (entry.id === issuer || entry.issuedBy === issuer);
    });
    if (!entry) return;
    let { name: action, restoreData, undo } = entry;
    if (!undo) undo = await waitForAction(action).then(action => action.undo!.bind(action));
    const redoData = await undo(entry.params, contexts, issuer, restoreData);
    entry.undone = true;
    entry.redo = redoData.redo;
    entry.restoreData = redoData.restoreData;
    entry.undo = undefined;
  }

  const redo = async (issuer: string) => {
    const entry = history.slice().reverse().find((entry) => {
      if (!entry.undone) return false;
      return (entry.id === issuer || entry.issuedBy === issuer);
    });
    if (!entry) return;
    let { name: action, restoreData, redo } = entry;
    if (!redo) redo = await waitForAction(action).then(action => action.redo?.bind(action));
    if (!redo) return await run(action, entry.params, issuer);
    const redoData = await redo(entry.params, contexts, issuer, restoreData);
    entry.undone = false;
    entry.undo = redoData.undo;
    entry.restoreData = redoData.restoreData;
    entry.redo = undefined;
  }

  for (const plugin of plugins) {
    if (plugin.restore && !restoring) {
      restoring = plugin.restore().then(entries => {
        history = entries;
        restoring = undefined;
      });
    }
  }


  return {
    hasAction,
    hasContext,
    getAction,
    getContext,
    registerAction,
    registerContext,
    waitForAction,
    waitForContext,
    run,
    undo,
    redo,
  };
}
