import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ISetting, IStorage } from '../interface';
import Setting from './setting';

class Storage {
  static async init() {
    //Default Storage Data
    let storageObj: IStorage = {
      collections: [] as ICollection[],
      setting: {} as ISetting,
    };

    storageObj.setting = Setting.init();

    await this.update(storageObj);
  }

  static async fetch(): Promise<IStorage> {
    let localStorage = (await Browser.storage.local.get()) as IStorage;
    return localStorage;
  }

  static async onInstallCheck() {
    console.log('onInstallCheck');

    let localStorage = await this.fetch();

    if (localStorage.collections == null) {
      //first installed
      await this.init();
      return;
    }
  }

  static async update(_storage: IStorage): Promise<boolean> {
    const storage = _storage;
    try {
      await Browser.storage.local.set(storage);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async clear() {
    await Browser.storage.local.clear();
    await this.onInstallCheck();

    return true;
  }
}

export default Storage;
