import { createSignal } from 'solid-js';

export type RefValue<Value> = (value?: Value) => Value;

export const useRef = <Value>(defaultValue: Value): RefValue<Value> => {
  const [ref, setRef] = createSignal<Value>(defaultValue);

  return (value?: Value) => {
    if (value !== undefined) setRef(value as never);

    return ref();
  };
};
