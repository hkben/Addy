import _ from 'lodash';
import Browser from 'webextension-polyfill';
import {
  CastSummary,
  ICollection,
  ICollectionItem,
  ICollectionSummary,
  ISetting,
  IStorage,
} from './interface';
import { v4 as uuidv4 } from 'uuid';
import moment, { ISO_8601 } from 'moment';

class Storage {
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

  static async getStorage(): Promise<IStorage> {
    let localStorage = (await Browser.storage.local.get()) as IStorage;
    return localStorage;
  }

  static async getSetting(): Promise<ISetting> {
    let localStorage = await this.getStorage();
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

  static async updateSetting(_setting: ISetting) {
    let localStorage = await this.getStorage();
    localStorage.setting = _setting;
    Browser.storage.local.set(localStorage);
  }

  static async saveItemToCollection(
    _collectionId: string,
    _content: string,
    _url: string = ''
  ) {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];

    let index = _.findIndex(collections, (i) => i.id == _collectionId);

    let url = _url != '' ? _url : document.URL;

    let item: ICollectionItem = {
      id: uuidv4(),
      content: _content,
      source: url,
      createTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
    };

    collections[index].items.push(item);

    collections[index].modifyTime = new Date().toISOString();

    Browser.storage.local.set(localStorage);
  }

  static async newCollectionAndSave(_collectionName: string, _content: string) {
    let localStorage = await this.getStorage();

    let item: ICollectionItem = {
      id: uuidv4(),
      content: _content,
      source: document.URL,
      createTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
    };

    let collection: ICollection = {
      id: uuidv4(),
      name: _collectionName,
      items: [item],
      createTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
    };

    localStorage.collections.push(collection);

    Browser.storage.local.set(localStorage);
  }

  static async newCollection(_collectionName: string) {
    let localStorage = (await Browser.storage.local.get()) as IStorage;

    let collection: ICollection = {
      id: uuidv4(),
      name: _collectionName,
      items: [],
      createTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
    };

    localStorage.collections.push(collection);

    Browser.storage.local.set(localStorage);
  }

  // static async setStorage(_data: IStorage): Promise<boolean> {
  //   Browser.storage.local.set(_data);
  //   return true;
  // }

  static async getCollections(): Promise<ICollection[]> {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];
    return collections;
  }

  static async getCollectionsSummary(
    _text: string = ''
  ): Promise<ICollectionSummary[]> {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];
    let summary = collections.map((o) => CastSummary(o, _text));
    return summary;
  }

  static async getCollection(_collectionId: string): Promise<ICollection> {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];

    let collection = _.find(collections, (o) => o.id == _collectionId)!;

    return collection;
  }

  static async removeAllItems(_collectionId: string) {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].items = [];

    console.log(collections);

    Browser.storage.local.set(localStorage);
  }

  static async removeCollection(_collectionId: string) {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];

    _.remove(collections, (o) => o.id == _collectionId)!;

    console.log(collections);

    Browser.storage.local.set(localStorage);
  }

  static async removeCollectionItem(_collectionId: string, _itemId: string) {
    try {
      let localStorage = await this.getStorage();
      let collections = localStorage.collections as ICollection[];

      let collectionIndex = _.findIndex(
        collections,
        (o) => o.id == _collectionId
      )!;

      _.remove(collections[collectionIndex].items, (o) => o.id == _itemId);

      Browser.storage.local.set(localStorage);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async importCollections(_collections: ICollection[]) {
    try {
      let localStorage = await this.getStorage();

      _collections.forEach((collection) => {
        //find if collection if exists
        let collectionIndex = _.findIndex(
          localStorage.collections,
          (o) => o.id == collection.id
        )!;

        if (collectionIndex == -1) {
          localStorage.collections.push(collection);
          return;
        }

        //Add createTime and modifyTime to collection if not valid
        if (moment(collection.createTime, ISO_8601).isValid() == false) {
          localStorage.collections[
            collectionIndex
          ].createTime = new Date().toISOString();
        }

        if (moment(collection.modifyTime, ISO_8601).isValid() == false) {
          localStorage.collections[
            collectionIndex
          ].modifyTime = new Date().toISOString();
        }

        collection.items.forEach((item) => {
          //find if item if exists in collection
          let itemIndex = _.findIndex(
            localStorage.collections[collectionIndex].items,
            (o) => o.id == item.id
          )!;

          //Add createTime and modifyTime to item if not valid
          if (moment(item.createTime, ISO_8601).isValid() == false) {
            item.createTime = new Date().toISOString();
          }

          if (moment(item.modifyTime, ISO_8601).isValid() == false) {
            item.modifyTime = new Date().toISOString();
          }

          if (itemIndex == -1) {
            localStorage.collections[collectionIndex].items.push(item);
            return;
          }

          //Replace item if exists
          localStorage.collections[collectionIndex].items[itemIndex] = item;
        });
      });

      Browser.storage.local.set(localStorage);
    } catch (e) {
      return false;
    }
    return true;
  }

  static async updateCollectionName(_collectionId: string, _name: string) {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].name = _name;

    Browser.storage.local.set(localStorage);
  }
}

export default Storage;
