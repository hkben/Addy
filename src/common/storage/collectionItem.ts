import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ICollectionItem } from '../interface';
import Collections from './collections';
import Storage from './storage';
import { v4 as uuidv4 } from 'uuid';

class CollectionItem {
  static async create(
    _collectionId: string,
    _content: string,
    _type: string,
    _url: string = ''
  ): Promise<boolean> {
    const collections = await Collections.fetchAll();

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

  static async delete(
    _collectionId: string,
    _itemId: string
  ): Promise<Boolean> {
    const collections = await Collections.fetchAll();

    let collectionIndex = _.findIndex(
      collections,
      (o) => o.id == _collectionId
    )!;

    let itemIndex = _.findIndex(
      collections[collectionIndex].items,
      (o) => o.id == _itemId
    )!;

    let datetime = new Date().toISOString();

    collections[collectionIndex].items[itemIndex].deleted = datetime;
    collections[collectionIndex].items[itemIndex].modifyTime = datetime;
    collections[collectionIndex].modifyTime = datetime;

    let result = await Collections.update(collections);

    return result;
  }

  static async updateContent(
    _collectionId: string,
    _itemId: string,
    _changes: Partial<ICollectionItem>
  ) {
    const collections = await Collections.fetchAll();

    let collectionIndex = _.findIndex(
      collections,
      (o) => o.id == _collectionId
    )!;

    let itemIndex = _.findIndex(
      collections[collectionIndex].items,
      (o) => o.id == _itemId
    )!;

    let datetime = new Date().toISOString();

    Object.assign(collections[collectionIndex].items[itemIndex], _changes);

    collections[collectionIndex].items[itemIndex].modifyTime = datetime;
    collections[collectionIndex].modifyTime = datetime;

    let result = await Collections.update(collections);

    return { result, datetime };
  }

  static async move(
    _collectionId: string,
    _itemId: string,
    _targetCollectionId: string
  ): Promise<boolean> {
    const collections = await Collections.fetchAll();

    if (_collectionId == _targetCollectionId) {
      return false;
    }

    let collectionIndex = _.findIndex(
      collections,
      (o) => o.id == _collectionId
    )!;

    let itemIndex = _.findIndex(
      collections[collectionIndex].items,
      (o) => o.id == _itemId
    )!;

    let item = _.cloneDeep(collections[collectionIndex].items[itemIndex]);

    //delete item
    let now = new Date();
    let datetime = now.toISOString();

    collections[collectionIndex].items[itemIndex].deleted = datetime;
    collections[collectionIndex].items[itemIndex].modifyTime = datetime;
    collections[collectionIndex].modifyTime = datetime;

    //copy item
    let targetCollectionIndex = _.findIndex(
      collections,
      (o) => o.id == _targetCollectionId
    )!;

    // Make sure the new item sorted after the original one
    let msAfterNow = now.getTime() + 1;
    let newDatetime = new Date(msAfterNow).toISOString();

    item.id = uuidv4();
    item.modifyTime = newDatetime;
    collections[targetCollectionIndex].items.push(item);
    collections[targetCollectionIndex].modifyTime = newDatetime;

    let result = await Collections.update(collections);

    return result;
  }
}

export default CollectionItem;
