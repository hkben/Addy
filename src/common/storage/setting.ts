import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ISetting } from '../interface';
import Storage from './storage';

class Setting {
  static async fetch(): Promise<ISetting> {
    let localStorage = await Storage.fetch();
    let setting = localStorage.setting;

    if (setting == null) {
      let defaultSetting: ISetting = {
        collectionsOrdering: {
          type: 0,
          descending: false,
        },
        quickSearch: false,
        darkMode: false,
      };

      return defaultSetting;
    }

    return setting;
  }

  static async update(_setting: ISetting) {
    let localStorage = await Storage.fetch();
    localStorage.setting = _setting;
    Browser.storage.local.set(localStorage);
  }
}

export default Setting;
