import { makeRegExp } from '../../shared/utils';

export const makePseudoElementCorrectContentText = (text: string) =>
  text?.replace(makeRegExp("/'/g"), "\\'").replace(makeRegExp('/\\n/g'), "''\\A''");
