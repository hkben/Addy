import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ICollectionItem, IStorage } from '../interface';
import { v4 as uuidv4 } from 'uuid';
import Storage from './storage';

class Collection {
  static async fetch(_collectionId: string): Promise<ICollection> {
    let localStorage = await Storage.fetch();
    let collections = localStorage.collections as ICollection[];

    let collection = _.find(collections, (o) => o.id == _collectionId)!;

    return collection;
  }

  static async create(_collectionName: string) {
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

  static async add(
    _collectionId: string,
    _content: string,
    _type: string,
    _url: string = ''
  ) {
    let localStorage = await Storage.fetch();
    let collections = localStorage.collections as ICollection[];

    let index = _.findIndex(collections, (i) => i.id == _collectionId);

    let url = _url != '' ? _url : document.URL;

    let item: ICollectionItem = {
      id: uuidv4(),
      content: _content,
      type: _type,
      source: url,
      createTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
    };

    collections[index].items.push(item);

    collections[index].modifyTime = new Date().toISOString();

    Browser.storage.local.set(localStorage);
  }

  static async delete(_collectionId: string) {
    let localStorage = await Storage.fetch();
    let collections = localStorage.collections as ICollection[];

    _.remove(collections, (o) => o.id == _collectionId)!;

    console.log(collections);

    Browser.storage.local.set(localStorage);
  }

  static async createAndAdd(
    _collectionName: string,
    _content: string,
    _type: string
  ) {
    let localStorage = await Storage.fetch();

    let item: ICollectionItem = {
      id: uuidv4(),
      content: _content,
      type: _type,
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

  static async deleteAllItems(_collectionId: string) {
    let localStorage = await Storage.fetch();
    let collections = localStorage.collections as ICollection[];

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].items = [];

    console.log(collections);

    Browser.storage.local.set(localStorage);
  }

  static async updateName(_collectionId: string, _name: string) {
    let localStorage = await Storage.fetch();
    let collections = localStorage.collections as ICollection[];

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].name = _name;
    collections[index].modifyTime = new Date().toISOString();

    Browser.storage.local.set(localStorage);
  }
}

export default Collection;
