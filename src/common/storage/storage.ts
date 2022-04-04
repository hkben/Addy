import _ from 'lodash';
import Browser from 'webextension-polyfill';
import Common from '../../pages/common';
import { ICollection, ISetting, IStorage } from '../interface';
import Setting from './setting';

class Storage {
  static async init() {
    const version = Browser.runtime.getManifest().version;

    //Default Storage Data
    let storageObj: IStorage = {
      installedVersion: version,
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

    let version = Browser.runtime.getManifest().version;
    let installedVersion = localStorage.installedVersion;

    if (installedVersion == null) {
      //first installed
      await this.init();
      return;
    }

    const isInstallingNewVersion = Common.versionCompare(
      installedVersion,
      version
    );

    if (isInstallingNewVersion == false) {
      return;
    }

    //Version Migration
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
