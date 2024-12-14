import { DexieDB } from '../../../_idb/_DexieDB';

type Storage = {};

class InviteIDB extends DexieDB<Storage> {
  constructor() {
    super('invite', {});
  }
}

export const inviteIDB = new InviteIDB();
