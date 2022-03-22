import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ISetting, IStorage } from '../../pages/interface';

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

    storageObj.setting = {
      collectionsOrdering: {
        type: 0,
        descending: false,
      },
      quickSearch: false,
      darkMode: false,
    };

    await Browser.storage.local.set(storageObj);
  }
}

export default Storage;
