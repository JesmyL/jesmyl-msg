// import { smylib } from 'shared/utils';

import { smylib } from '../SMyLib';

export const setSharedPolyfills = () => {
  const setArrayProtoMethod = <Name extends keyof typeof Array.prototype>(
    name: Name,
    value: (typeof Array.prototype)[Name],
  ) => {
    if (!Array.prototype[name])
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(Array.prototype, name, {
        value,
        enumerable: false,
      });
  };

  const setStringProtoMethod = <Name extends keyof typeof String.prototype>(
    name: Name,
    value: (typeof String.prototype)[Name],
  ) => {
    if (!String.prototype[name])
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(String.prototype, name, {
        value,
        enumerable: false,
      });
  };

  setArrayProtoMethod('flat', function <Item>(this: any, depth?: number) {
    // eslint-disable-next-line strict
    'use strict';
    if (depth === undefined) depth = 1;
    var flatten: (arr: Item[], depth: number) => Item[] = function (arr: Item[], depth: number) {
      if (depth < 1) return arr.slice();
      return arr.reduce((acc: Item[], val: Item) => {
        return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
      }, []);
    };
    return flatten(this, depth);
  });

  setArrayProtoMethod('at', function (this: Array<any>, pos) {
    return pos < 0 ? this[this.length + pos] : this[pos];
  });

  setArrayProtoMethod('merge', function (this: Array<any>, array) {
    if (array !== undefined) for (let i = 0; i < array.length; i++) this.push(array[i]);

    return this;
  });

  setStringProtoMethod('reverse', function (this: String) {
    let res = '';
    for (let i = this.length - 1; i >= 0; i--) res += this[i];

    return res;
  });

  (globalThis as any).setTimeoutEffect = (handler: (...args: any[]) => void, timeout: number, ...args: any[]) => {
    const timer = setTimeout(handler, timeout, ...args);

    return () => clearTimeout(timer);
  };

  ///////////////////////////////////
  // force resigns for unifications//
  ///////////////////////////////////

  // eslint-disable-next-line no-extend-native
  Array.prototype.toSorted = function (compareFunction) {
    return smylib.toSorted(this, compareFunction);
  };

  // eslint-disable-next-line no-extend-native
  Array.prototype.sort = function (compareFunction) {
    return smylib.sort(this, compareFunction);
  };

  (BigInt.prototype as any).toJSON = function () {
    return +('' + this);
  };
};

declare global {
  function setTimeoutEffect<Args extends any[]>(
    handler: (...args: Args) => void,
    timeout?: number,
    ...args: Args
  ): () => void;

  interface Array<T> {
    toSorted: (compareFn?: (a: T, b: T) => number) => T[];
    merge: (array: T[] | und) => T[];
  }

  interface String {
    reverse: () => string;
  }
}

export {};
