import _, { result } from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ICollectionItem, IStorage } from '../interface';
import { v4 as uuidv4 } from 'uuid';
import Storage from './storage';
import Collections from './collections';

class Collection {
  static async fetch(
    _collectionId: string,
    _includeDeletedItem: boolean = false
  ): Promise<ICollection> {
    const collections = await Collections.fetch();
    let collection = _.find(collections, (o) => o.id == _collectionId)!;

    if (_includeDeletedItem == false) {
      collection.items = _.filter(collection.items, (o) => o.deleted != true);
    }

    return collection;
  }

  static async create(_collectionName: string): Promise<string> {
    const collections = await Collections.fetch();

    let collection: ICollection = {
      id: uuidv4(),
      name: _collectionName,
      items: [],
      createTime: new Date().toISOString(),
      modifyTime: new Date().toISOString(),
    };

    collections.push(collection);

    let result = await Collections.update(collections);

    if (result) {
      return collection.id;
    } else {
      return '';
    }
  }

  static async add(
    _collectionId: string,
    _content: string,
    _type: string,
    _url: string = ''
  ): Promise<boolean> {
    const collections = await Collections.fetch();

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

    let result = await Collections.update(collections);
    return result;
  }

  static async delete(_collectionId: string): Promise<boolean> {
    const collections = await Collections.fetch();

    let collectionIndex = _.findIndex(
      collections,
      (o) => o.id == _collectionId
    )!;

    collections[collectionIndex].deleted = true;
    collections[collectionIndex].modifyTime = new Date().toISOString();

    let result = await Collections.update(collections);
    return result;
  }

  static async createAndAdd(
    _collectionName: string,
    _content: string,
    _type: string
  ) {
    let collectionId = await this.create(_collectionName);

    if (collectionId == '') {
      return false;
    }

    let result = await this.add(collectionId, _content, _type);

    return result;
  }

  static async deleteAllItems(_collectionId: string) {
    const collections = await Collections.fetch();

    let collectionIndex = _.findIndex(
      collections,
      (o) => o.id == _collectionId
    )!;

    let datetime = new Date().toISOString();

    collections[collectionIndex].items.forEach((element) => {
      element.deleted = true;
      element.modifyTime = datetime;
    });

    collections[collectionIndex].modifyTime = datetime;

    let result = await Collections.update(collections);
    return result;
  }

  static async updateName(_collectionId: string, _name: string) {
    const collections = await Collections.fetch();

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].name = _name;
    collections[index].modifyTime = new Date().toISOString();

    let result = await Collections.update(collections);
    return result;
  }

  static async updateColor(_collectionId: string, _color: number) {
    const collections = await Collections.fetch();

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].color = _color;
    collections[index].modifyTime = new Date().toISOString();

    let result = await Collections.update(collections);
    return result;
  }
}

export default Collection;
