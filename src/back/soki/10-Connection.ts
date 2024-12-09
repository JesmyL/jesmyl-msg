import { WebSocket, WebSocketServer } from 'ws';
import { SokiCapsule, SokiClientEvent, SokiServerEvent } from '../../shared/api';
import { Auth } from '../../shared/api/complect/auth';
import { Eventer } from '../../shared/utils';

type EventSendEvent = { event: SokiClientEvent; client: WebSocket };

export class SokiServerConnection {
  private ws = new WebSocketServer({ port: 3359 });

  private onEventValueSend = Eventer.createValue<EventSendEvent>();
  private clientDisconnectListeners = Eventer.createValue<WebSocket>();
  private onClientConnectEventer = Eventer.createValue<WebSocket>();

  protected capsulesByLogin = new Map<string, Set<SokiCapsule>>();
  protected capsules = new Map<WebSocket, SokiCapsule>();
  protected onCapsuleSetValue = Eventer.createValue<SokiCapsule>();

  actionWithCapsule(client: WebSocket, cb: (capsule: SokiCapsule) => void, triesCount = 10) {
    const tryAction = (triesCount: number) => {
      const capsule = this.capsules.get(client);
      if (capsule !== undefined) return cb(capsule);
      if (triesCount > 0) setTimeout(tryAction, 10, triesCount - 1);
    };

    tryAction(triesCount);
  }

  protected get clients() {
    return this.ws.clients;
  }

  protected onClientEvent = this.onEventValueSend.listen;
  protected onClientDisconnect = this.clientDisconnectListeners.listen;
  protected onClientConnect = this.onClientConnectEventer.listen;

  start() {
    this.ws.on('connection', (client: WebSocket) => {
      this.onClientConnectEventer.invoke(client);

      client.on('close', () => this.clientDisconnectListeners.invoke(client));

      let setCapsule = (auth: Auth) => {
        setCapsule = () => {};

        const capsule = { auth, client };
        this.capsules.set(client, capsule);
        const capsules = this.capsulesByLogin.get(auth.login);

        if (capsules === undefined) this.capsulesByLogin.set(auth.login, new Set([capsule]));
        else capsules.add(capsule);

        this.onCapsuleSetValue.invoke(capsule);
      };

      client.on('message', messageJson => {
        const event: SokiClientEvent = JSON.parse('' + messageJson);
        this.onEventValueSend.invoke({ event, client });
        setCapsule(event.auth);
      });
    });
  }

  protected send(event: SokiServerEvent, client: WebSocket) {
    client.send(JSON.stringify(event, (_key, value) => (typeof value === 'bigint' ? Number(value) : value)));
  }
}
