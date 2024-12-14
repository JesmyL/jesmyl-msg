export interface EventerCallbackEvent<Value, StopValue> {
  value: Value;
  stopPropagation: (stopValue?: StopValue) => void;
  stoppedValue?: StopValue;
  preventDefault: () => void;
  preventedDefault: boolean;
  mute: () => void;
  passValue?: any;
}

export type EventerCallback<Value, Return = void, StopValue = any> = (
  event: EventerCallbackEvent<Value, StopValue>,
) => Return;
export type EventerListeners<Value, Return = void, StopValue = any> = EventerCallback<Value, Return, StopValue>[];

export type EventerValueCallback<Value, Return = void> = (value: Value) => Return;
export type EventerValueListeners<Value, Return = void> =
  | EventerValueCallback<Value, Return>[]
  | Set<EventerValueCallback<Value, Return>>;

export type EventerListenScope<Value = void> = {
  listen: (cb: EventerValueCallback<Value>) => () => void;
  listenFirst: (cb: EventerValueCallback<Value>) => void;
  mute: (cb: EventerValueCallback<Value>) => void;
  invoke: (value: Value) => Value;
};

export class Eventer {
  static listen = <
    Lis extends EventerListeners<any, Return>,
    Value extends Lis extends EventerListeners<infer E, Return> ? E : never,
    Return,
    StopValue extends Lis extends EventerListeners<Value, Return, infer E> ? E : never,
  >(
    listeners: Lis,
    cb: EventerCallback<Value, Return, StopValue>,
    invokeInitValue?: Value,
  ) => {
    if (invokeInitValue !== undefined)
      cb({
        value: invokeInitValue,
        mute: () => {},
        preventDefault: () => {},
        preventedDefault: false,
        stopPropagation: () => {},
      });

    listeners.push(cb);

    return () => this.mute(listeners, cb);
  };

  static mute = <
    Lis extends EventerListeners<any, Return>,
    Value extends Lis extends EventerListeners<infer E, Return> ? E : never,
    Return,
  >(
    listeners: Lis,
    cb: EventerCallback<Value, Return>,
  ) => {
    const index = listeners.indexOf(cb);
    listeners.splice(index, 1);
  };

  static invoke = async <
    Lis extends EventerListeners<any, Return>,
    Value extends Lis extends EventerListeners<infer E, Return> ? E : never,
    Return,
    StopValue extends Lis extends EventerListeners<Value, Return, infer E> ? E : never,
  >(
    listeners: Lis,
    value: Value,
    onEachInvoke?: (ret: Return) => void,
  ) => {
    let i = listeners.length - 1;
    const event: EventerCallbackEvent<Value, StopValue> = {
      value,
      mute: () => listeners.splice(i, 1),
      preventDefault: () => (event.preventedDefault = true),
      preventedDefault: false,
      stopPropagation: stopValue => {
        event.stoppedValue = stopValue;
        i = -1;
      },
    };

    for (; i > -1; i--) {
      if (onEachInvoke === undefined) await listeners[i](event);
      else onEachInvoke(listeners[i](event));
    }

    return event;
  };

  static listenValue = <
    Lis extends EventerValueListeners<any, Return>,
    Value extends Lis extends EventerValueListeners<infer E, Return> ? E : never,
    Return,
  >(
    listeners: Lis,
    cb: (value: Value) => Return,
    invokeInitValue?: Value,
  ) => {
    if (invokeInitValue !== undefined) cb(invokeInitValue);

    if (Array.isArray(listeners)) listeners.push(cb);
    else listeners.add(cb);

    return () => this.muteValue(listeners, cb);
  };

  static muteValue = <
    Lis extends EventerValueListeners<any, Return>,
    Value extends Lis extends EventerValueListeners<infer E, Return> ? E : never,
    Return,
  >(
    listeners: Lis,
    cb: (value: Value) => Return,
  ) => {
    if (Array.isArray(listeners)) listeners.splice(listeners.indexOf(cb), 1);
    else listeners.delete(cb);
  };

  static invokeValue = <
    Lis extends EventerValueListeners<any, Return>,
    Value extends Lis extends EventerValueListeners<infer E, Return> ? E : never,
    Return,
  >(
    listeners: Lis,
    value: Value,
    onEachInvoke?: (ret: Return) => void,
  ): Value => {
    if (Array.isArray(listeners))
      if (onEachInvoke === undefined) {
        for (let i = listeners.length - 1; i > -1; i--) listeners[i](value);
      } else {
        for (let i = listeners.length - 1; i > -1; i--) onEachInvoke(listeners[i](value));
      }
    else listeners.forEach(cb => cb(value));

    return value;
  };

  static createValue<Value = void>(): EventerListenScope<Value> {
    const listeners: EventerValueListeners<Value> = new Set();

    return {
      listen: cb => this.listenValue(listeners, cb),
      mute: cb => this.muteValue(listeners, cb),
      invoke: value => this.invokeValue(listeners, value),
      listenFirst: cb => {
        const rem = this.listenValue(listeners, value => {
          cb(value);
          rem();
        });
      },
    };
  }
}
