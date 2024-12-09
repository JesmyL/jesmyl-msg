import { knownClassNamesDict } from './stylesDict';

export type KnownClassNames = DeepKeys<typeof knownClassNamesDict>;

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | `${K}${DeepKeysInnerCases<T[K]>}` : never;
    }[keyof T]
  : never;

type DeepKeysInnerCases<T> = T extends object
  ? {
      [K in keyof T]-?: K extends `-${string}` ? `${K}` | `${K}${DeepKeysInnerCases<T[K]>}` : never;
    }[keyof T]
  : never;
