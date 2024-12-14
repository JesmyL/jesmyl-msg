import { Auth } from '../../shared/api/complect/auth';
import { JSoki, JSokiApi, SokiClientEvent, SokiServerEvent } from '../../shared/api/complect/soki';
import { Eventer } from '../../shared/utils';
import { complectIDB } from '../_idb/complect.idb';

class Soki<
  Path extends 'websocketm' | 'websocket',
  ServerEvent extends Path extends 'websocketm' ? SokiServerEvent : JSokiApi.SokiServerEvent,
  ClientEvent extends Path extends 'websocketm' ? SokiClientEvent : JSokiApi.SokiClientEvent,
> {
  private ws: WebSocket | null = null;
  private _onImportableEvent = Eventer.createValue<ServerEvent>();
  private onConnectionAction = Eventer.createValue();
  private responseWaiters: Record<string, (event: ServerEvent) => void> = {};

  constructor(private path: Path) {}

  private onClose = () => {
    setTimeout(() => this.start(), 500);
  };

  start() {
    this.ws = new WebSocket(`wss://jesmyl.ru/${this.path}/`);
    this.ws.onopen = () => this.onConnectionAction.invoke();
    this.ws.onclose = this.onClose;

    this.ws.onmessage = message => {
      const event = JSON.parse(message.data);

      if (event.requestId !== undefined) this.responseWaiters[event.requestId]?.(event);

      this._onImportableEvent.invoke(event);
    };
  }

  onImportableEvent = this._onImportableEvent.listen;

  send(event: OmitOwn<ClientEvent, 'auth'>) {
    let requestId: string | und;
    const send = async () => {
      let auth: Auth | und;

      try {
        auth = await complectIDB.getSingleValue('auth');
      } catch (e) {}

      const eventStr = JSON.stringify({ ...event, auth, requestId });

      this.ws?.send(eventStr);
    };

    Promise.resolve().then(() => {
      if (this.ws == null || this.ws.readyState === this.ws.OPEN) send();
      else this.onConnectionAction.listen(send);
    });

    return {
      on: (cb: (event: ServerEvent) => void) => {
        requestId = '' + Date.now() + Math.random();
        this.responseWaiters[requestId] = cb;
      },
    };
  }

  sendExternal(body: JSokiApi.SokiClientEvent['body']) {
    if (this.path !== 'websocket') return { on() {} };

    return this.send({
      body,
      appName: 'external',
      deviceId: JSoki.DeviceId.def,
      urls: [location.href],
      version: -1,
    } as never);
  }
}

export const sokim = new Soki('websocketm');
export const sokij = new Soki('websocket');
