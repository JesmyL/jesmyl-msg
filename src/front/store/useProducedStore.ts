import { createStore, produce } from 'solid-js/store';

export const createProducedStore = <Value extends object>(store?: Value, options?: { name?: string }) => {
  const [value, setter] = createStore<Value>(store as never, options);
  return [value, (set: (value: Value) => void) => setter(produce(set as never) as never)] as const;
};
