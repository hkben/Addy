import _, { result } from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ICollectionItem, IStorage } from '../interface';
import { v4 as uuidv4 } from 'uuid';
import Storage from './storage';
import Collections from './collections';
import CollectionItem from './collectionItem';

class Collection {
  static async fetchOneById(
    _collectionId: string,
    _includeDeletedItem: boolean = false
  ): Promise<ICollection> {
    const collections = await Collections.fetchAll();
    let collection = _.find(collections, (o) => o.id == _collectionId)!;

    if (_includeDeletedItem == false) {
      collection.items = _.filter(
        collection.items,
        (o) => o.deleted == undefined
      );
    }

    return collection;
  }

  static async create(_collectionName: string): Promise<string> {
    const collections = await Collections.fetchAll();

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

  static async delete(_collectionId: string): Promise<boolean> {
    const collections = await Collections.fetchAll();

    let collectionIndex = _.findIndex(
      collections,
      (o) => o.id == _collectionId
    )!;

    let datetime = new Date().toISOString();

    collections[collectionIndex].deleted = datetime;
    collections[collectionIndex].modifyTime = datetime;

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

    let result = await CollectionItem.create(collectionId, _content, _type);

    return result;
  }

  static async deleteAllItems(_collectionId: string) {
    const collections = await Collections.fetchAll();

    let collectionIndex = _.findIndex(
      collections,
      (o) => o.id == _collectionId
    )!;

    let datetime = new Date().toISOString();

    collections[collectionIndex].items.forEach((element) => {
      element.deleted = datetime;
      element.modifyTime = datetime;
    });

    collections[collectionIndex].modifyTime = datetime;

    let result = await Collections.update(collections);
    return result;
  }

  static async updateName(_collectionId: string, _name: string) {
    const collections = await Collections.fetchAll();

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].name = _name;
    collections[index].modifyTime = new Date().toISOString();

    let result = await Collections.update(collections);
    return result;
  }

  static async updateColor(_collectionId: string, _color: number) {
    const collections = await Collections.fetchAll();

    let index = _.findIndex(collections, (o) => o.id == _collectionId)!;

    collections[index].color = _color;
    collections[index].modifyTime = new Date().toISOString();

    let result = await Collections.update(collections);
    return result;
  }
}

export default Collection;
