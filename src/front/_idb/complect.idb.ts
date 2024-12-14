import { createDexieSignalQuery } from 'solid-dexie';
import { Auth } from '../../shared/api/complect/auth';
import { DexieDB } from './_DexieDB';

type Storage = {
  auth: Auth;
};

class ComplectIDB extends DexieDB<Storage> {
  constructor() {
    super('complect', {
      auth: 0,
    });
  }
}

export const complectIDB = new ComplectIDB();

export const authSignal = createDexieSignalQuery(() => complectIDB.getSingleValue('auth'));
