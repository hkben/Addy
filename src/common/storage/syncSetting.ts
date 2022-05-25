import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { IStorage, ISyncSetting } from '../interface';

class SyncSetting {
  static init() {
    const defaultSetting: ISyncSetting = {
      enable: false,
      autoSyncInterval: 0,
      lastSyncTime: '',
      provider: '',
    };
    return defaultSetting;
  }

  static async fetch(): Promise<ISyncSetting> {
    //Default Data for SyncSetting
    let syncSetting: ISyncSetting = this.init();

    try {
      //It returns {setting}, so IStorage is better choice, not ISyncSetting
      let localStorage = (await Browser.storage.local.get(
        'syncSetting'
      )) as IStorage;

      if (localStorage.syncSetting != null) {
        syncSetting = localStorage.syncSetting;
      }
    } catch (e) {
      console.error(e);
    }
    return syncSetting;
  }

  static async update(_syncSetting: ISyncSetting): Promise<boolean> {
    const syncSetting = _syncSetting;
    try {
      await Browser.storage.local.set({ syncSetting });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateLastSyncTime(_datetime: string = ''): Promise<boolean> {
    try {
      let syncSetting = await this.fetch();
      syncSetting.lastSyncTime = _datetime;
      this.update(syncSetting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }
}

export default SyncSetting;
