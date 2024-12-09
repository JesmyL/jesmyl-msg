import { createContext, useContext } from 'solid-js';

export const contextCreator = <T>(defaultValue: T) => {
  const Context = createContext(defaultValue);
  return [Context, () => useContext(Context)] as const;
};
