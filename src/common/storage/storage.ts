import _ from 'lodash';
import Browser from 'webextension-polyfill';
import Common from '../../pages/common';
import { ICollection, ISetting, IStorage, ISyncSetting } from '../interface';
import Collections from './collections';
import Setting from './setting';

class Storage {
  static async init() {
    const version = Browser.runtime.getManifest().version;

    //Default Storage Data
    let storageObj: IStorage = {
      installedVersion: version,
      collections: [] as ICollection[],
      setting: {} as ISetting,
      syncSetting: {} as ISyncSetting,
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

    console.log(`[Migration] Instaling from ${installedVersion} to ${version}`);

    const isInstallingNewVersion = Common.versionCompare(
      installedVersion,
      version
    );

    if (isInstallingNewVersion == false) {
      return;
    }

    //Version Migration
    if (version == '0.0.4' && installedVersion <= '0.0.3') {
      console.log('[Migration] Update to 0.0.4');
      await Collections.updateDeletedToDateTime();
    }

    localStorage.installedVersion = version;
    await this.update(localStorage);
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
