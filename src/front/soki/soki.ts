import { SokiClientEvent, SokiServerEvent } from '../../shared/api/complect/soki';
import { Eventer } from '../../shared/utils';
import { complectIDB } from '../_idb/complect.idb';

class Soki {
  private ws: WebSocket | null = null;
  private _onImportableEvent = Eventer.createValue<SokiServerEvent>();
  private onConnectionAction = Eventer.createValue();
  private responseWaiters: Record<string, (event: SokiServerEvent) => void> = {};

  constructor() {}

  private onClose = () => {
    setTimeout(() => this.start(), 500);
  };

  start() {
    this.ws = new WebSocket(`wss://jesmyl.ru/websocketm/`);
    this.ws.onopen = () => this.onConnectionAction.invoke();
    this.ws.onclose = this.onClose;

    this.ws.onmessage = message => {
      const event: SokiServerEvent = JSON.parse(message.data);

      if (event.requestId !== undefined) this.responseWaiters[event.requestId]?.(event);

      this._onImportableEvent.invoke(event);
    };
  }

  onImportableEvent = this._onImportableEvent.listen;

  send(event: OmitOwn<SokiClientEvent, 'auth'>) {
    let requestId: string | und;
    const send = async () => {
      const auth = await complectIDB.getSingleValue('auth');

      if (auth === undefined) return;

      const eventStr = JSON.stringify({ ...event, auth, requestId });

      this.ws?.send(eventStr);
    };

    Promise.resolve().then(() => {
      if (this.ws == null || this.ws.readyState === this.ws.OPEN) send();
      else this.onConnectionAction.listen(send);
    });

    return {
      on: (cb: (event: SokiServerEvent) => void) => {
        requestId = '' + Date.now() + Math.random();
        this.responseWaiters[requestId] = cb;
      },
    };
  }
}

export const soki = new Soki();
