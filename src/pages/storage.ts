import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ICollectionItem, IStorage } from './interface';
import { v4 as uuidv4 } from 'uuid';

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
    };

    await Browser.storage.local.set(storageObj);
  }

  static async getStorage(): Promise<IStorage> {
    let localStorage = (await Browser.storage.local.get()) as IStorage;
    return localStorage;
  }

  static async saveItemToCollection(_collectionId: string, _text: string) {
    let localStorage = await this.getStorage();
    let collections = localStorage.collections as ICollection[];

    let index = _.findIndex(collections, (i) => i.id == _collectionId);

    let item: ICollectionItem = {
      id: uuidv4(),
      text: _text,
      source: document.URL,
      createTime: new Date(),
      modifyTime: new Date(),
    };

    collections[index].items.push(item);

    Browser.storage.local.set(localStorage);
  }

  static async newCollection(_collectionName: string) {
    let localStorage = (await Browser.storage.local.get()) as IStorage;

    let collection: ICollection = {
      id: uuidv4(),
      name: _collectionName,
      items: [],
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
}

export default Storage;
