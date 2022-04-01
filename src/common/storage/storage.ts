import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ISetting, IStorage } from '../interface';
import Setting from './setting';

class Storage {
  static async fetch(): Promise<IStorage> {
    let localStorage = (await Browser.storage.local.get()) as IStorage;
    return localStorage;
  }

  static async onInstallCheck() {
    console.log('onInstallCheck');

    let localStorage = (await Browser.storage.local.get()) as IStorage;

    console.log(localStorage);

    if (localStorage.collections != null) {
      return;
    }

    //Default Storage Data
    let storageObj: IStorage = {
      collections: [] as ICollection[],
      setting: {} as ISetting,
    };

    storageObj.setting = Setting.init();

    await Browser.storage.local.set(storageObj);
  }

  static async clear() {
    await Browser.storage.local.clear();
    await this.onInstallCheck();

    return true;
  }
}

export default Storage;
