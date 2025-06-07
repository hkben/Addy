import _ from 'lodash';
import { SortingState } from '@tanstack/react-table';
import Browser from 'webextension-polyfill';
import { IOrdering, ISetting, IStorage, IViewingOption } from '../interface';
import log from 'loglevel';

class Setting {
  static init() {
    const defaultSetting: ISetting = {
      collectionsOrdering: {
        type: 0,
        descending: false,
      },
      quickSearch: false,
      darkMode: false,
      viewingOption: {
        hiddenColumns: [],
        spacing: 'normal',
        imageColumns: 3,
        sortBy: [],
        timeDisplay: 0,
        imageSearchEngine: 0,
      },
      debugMode: false,
    };
    return defaultSetting;
  }

  static async fetch(): Promise<ISetting> {
    //Default Data for Setting
    let setting: ISetting = this.init();

    try {
      //It returns {setting}, so IStorage is better choice, not ISetting
      let localStorage = (await Browser.storage.local.get(
        'setting'
      )) as IStorage;

      if (localStorage.setting != null) {
        setting = localStorage.setting;
      }
    } catch (e) {
      log.error(e);
    }
    return setting;
  }

  static async update(_setting: ISetting): Promise<boolean> {
    const setting = _setting;
    try {
      await Browser.storage.local.set({ setting });
    } catch (e) {
      log.error(e);
      return false;
    }
    return true;
  }
}

export default Setting;
