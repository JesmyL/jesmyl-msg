enum NotANumber {
  nan = NaN,
}

declare global {
  type num = 0 | 1;
  type str = '' | '1';
  type nil = null | undefined;
  type und = undefined;
  type ArrayMapCb<T> = (box: T, boxi: number, boxa: T[]) => T;
  type ArrayCb<T> = (box: T, boxi: number, boxa: T[]) => any;
  type TimeOut = ReturnType<typeof setTimeout> | und | number;
  type intStr = `${'-' | ''}${number}`;
  type doubleStr = `${'-' | ''}${intStr}.${number}`;
  type numberStr = `${'-' | ''}${intStr}${`.${number}` | ''}`;
  type StringBySlash = `${string}/${string}`;

  type OmitOwn<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
  type WithRewrites<T, P> = Pick<T, Exclude<keyof T, keyof P>> & Pick<P, keyof P>;

  type NaN = NotANumber;
  type NaNumber = number | NotANumber;

  type EventStopper<With = {}> = { stopPropagation(): void } & With;
  type CallbackStopper = (event: EventStopper) => void;

  type EventPreventer<With = {}> = { preventDefault(): void } & With;
  type CallbackPreventer = (event: EventPreventer) => void;

  type CallbackPreventerAndStopper = (event: EventPreventer & EventStopper) => void;

  type NonUndefined<T> = T extends undefined ? never : T;
  type NonNull<T> = T extends null ? never : T;
  type NonNil<T> = T extends nil ? never : T;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
  type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);
}

export {};
