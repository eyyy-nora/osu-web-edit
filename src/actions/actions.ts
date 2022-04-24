import {
  ActionRegistryPlugin,
  createActionRegistry
} from "src/actions/registry";



function actionHistoryStorage(storage: Storage, key = "action-history"): ActionRegistryPlugin {
  return {
    async restore() {
      const history = storage.getItem(key);
      if (!history) return [];
      return JSON.parse(history);
    },
    async persist(entries) {
      storage.setItem(key, JSON.stringify(entries));
    }
  };
}

export const actions = createActionRegistry({
  plugins: [actionHistoryStorage(localStorage)]
});

export function contextAction(name: string, fn: (context: any) => void, context: string): void {
  actions.registerAction(name, {
    async run(params, contexts) {
      await fn(contexts[context]);
    }
  }, [context])
}
