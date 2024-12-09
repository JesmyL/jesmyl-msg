import Dexie, { EntityTable, PromiseExtended } from 'dexie';
import { SMyLib, smylib } from '../../shared/utils';

const _isSingleValueIncoming = '_asSignalValueId_';
const _singleValueSysIndex = '_$ID_';
const valueSysIndex = 1;

const keyvalues = '%keyvalues%';

export class DexieDB<Store extends Record<string, object>> {
  db: Dexie &
    Required<{
      [K in keyof Store]: Store[K] extends any[]
        ? EntityTable<Store[K][number], keyof Store[K][number]>
        : EntityTable<Store[K], keyof Store[K]>;
    }>;

  private tryIsSimpleValue: <Key extends keyof Store>(key: Key) => void;

  constructor(
    storageName: string,
    private defaults: Required<{
      [K in keyof Store]: Store[K] extends any[]
        ? Required<Record<keyof Store[K][number], true | '++'>> & { _?: '++' }
        : number;
    }>,
    version = 1,
  ) {
    this.db = new Dexie(storageName) as never;
    const numsMap = new Map<number, string>();

    const stores = Object.keys(defaults).reduce(
      (acc, key) => {
        const def = defaults[key];
        if (smylib.isNum(def)) {
          if (numsMap.has(def)) throw new Error(`"${key}" and "${numsMap.get(def)}" has same key ${def}`);
          numsMap.set(def, key);
          return acc;
        }

        acc[key] = SMyLib.entries(defaults[key])
          .map(([key, val]) => `${val === '++' ? '++' : ''}${key as never}`)
          .join(', ');

        return acc;
      },
      {} as Record<string, string>,
    );

    stores[keyvalues] = '++key, val';

    this.db.version(version).stores(stores);

    if (import.meta.env.DEV)
      this.tryIsSimpleValue = key => {
        if (smylib.isNum(this.defaults[key])) return;
        throw new Error(`${key as never} is not simple object value`);
      };
    else this.tryIsSimpleValue = () => {};
  }

  getSingleValue<Key extends keyof Store>(key: Key) {
    this.tryIsSimpleValue(key);

    return this.db[keyvalues]
      .where('key')
      .equals(key as never)
      .first()
      .then(r => (r as { val: '' }).val) as PromiseExtended<Store[Key]>;
  }

  async setSingleValue<Key extends keyof Store, Value extends Store[Key] extends any[] ? never : Store[Key]>(
    key: Key,
    value: Value | ((value: Value) => Value),
  ) {
    this.tryIsSimpleValue(key);

    if (smylib.isFunc(value)) {
      return await this.db[keyvalues].put({
        key,
        val: value((await this.getSingleValue(key)) as never),
      } as never);
    } else {
      return await this.db[keyvalues].put({ key, val: value } as never);
    }
  }

  async remSingleValue<Key extends keyof Store>(key: Key) {
    this.tryIsSimpleValue(key);
    return await this.db[keyvalues].delete(this.defaults[key] as never);
  }
}
