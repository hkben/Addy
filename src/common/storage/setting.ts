import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { IOrdering, ISetting, IStorage } from '../interface';

class Setting {
  static init() {
    const defaultSetting: ISetting = {
      collectionsOrdering: {
        type: 0,
        descending: false,
      },
      quickSearch: false,
      darkMode: false,
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
      console.error(e);
    }
    return setting;
  }

  static async fetchOrdering(): Promise<IOrdering> {
    let setting = await this.fetch();
    return setting.collectionsOrdering;
  }

  static async fetchDarkMode(): Promise<Boolean> {
    let setting = await this.fetch();
    return setting.darkMode;
  }

  static async update(_setting: ISetting): Promise<Boolean> {
    const setting = _setting;
    try {
      await Browser.storage.local.set({ setting });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateOrdering(_ordering: IOrdering): Promise<Boolean> {
    try {
      let setting = await this.init();
      setting.collectionsOrdering = _ordering;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateDarkMode(_darkMode: boolean): Promise<Boolean> {
    try {
      let setting = await this.init();
      setting.darkMode = _darkMode;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }
}

export default Setting;
