import _ from 'lodash';
import { SortingState } from '@tanstack/react-table';
import Browser from 'webextension-polyfill';
import { IOrdering, ISetting, IStorage, IViewingOption } from '../interface';

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
      },
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

  static async fetchDarkMode(): Promise<boolean> {
    let setting = await this.fetch();
    return setting.darkMode;
  }

  static async fetchViewingOption(): Promise<IViewingOption> {
    let setting = await this.fetch();
    return setting.viewingOption;
  }

  static async update(_setting: ISetting): Promise<boolean> {
    const setting = _setting;
    try {
      await Browser.storage.local.set({ setting });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateOrdering(_ordering: IOrdering): Promise<boolean> {
    try {
      let setting = await this.fetch();
      setting.collectionsOrdering = _ordering;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateDarkMode(_darkMode: boolean): Promise<boolean> {
    try {
      let setting = await this.fetch();
      setting.darkMode = _darkMode;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateViewingHiddenColumns(
    _hiddenColumns: string[]
  ): Promise<boolean> {
    try {
      let setting = await this.fetch();

      //return true when data is not changed
      if (setting.viewingOption.hiddenColumns == _hiddenColumns) {
        return true;
      }

      setting.viewingOption.hiddenColumns = _hiddenColumns;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateViewingSpacing(_spacing: string): Promise<boolean> {
    try {
      let setting = await this.fetch();
      setting.viewingOption.spacing = _spacing;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateViewingSortBy(_sortBy: SortingState): Promise<boolean> {
    try {
      let setting = await this.fetch();

      //return true when data is not changed
      if (setting.viewingOption.sortBy == _sortBy) {
        return true;
      }

      setting.viewingOption.sortBy = _sortBy;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async updateViewingImageGrid(_columns: number): Promise<boolean> {
    try {
      let setting = await this.fetch();
      setting.viewingOption.imageColumns = _columns;
      this.update(setting);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }
}

export default Setting;
