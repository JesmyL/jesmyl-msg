import { KnownClassNames } from './model';
import { knownClassNamesDict } from './stylesDict';
import { addKnownClassNameStyles } from './utils';

export * from './model';

export const knownUtilTypographyClassNames = addKnownClassNameStyles(knownClassNamesDict);

export const joinKnownClassNames = (names: (KnownClassNames | '')[], unknownClassName?: string) =>
  names.join(' ') + (unknownClassName === undefined ? '' : ' ' + unknownClassName);
