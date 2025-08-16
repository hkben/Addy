import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection, ICollectionItem } from '../interface';
import Collections from './collections';
import Storage from './storage';
import { v4 as uuidv4 } from 'uuid';

class CollectionItem {
  static async delete(
    _collectionId: string,
    _itemId: string
  ): Promise<Boolean> {
    const collections = await Collections.fetch();

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
    const collections = await Collections.fetch();

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
  ) {
    const collections = await Collections.fetch();

    if (_collectionId == _targetCollectionId) {
      return;
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
    let datetime = new Date().toISOString();

    collections[collectionIndex].items[itemIndex].deleted = datetime;
    collections[collectionIndex].items[itemIndex].modifyTime = datetime;
    collections[collectionIndex].modifyTime = datetime;

    //copy item
    let targetCollectionIndex = _.findIndex(
      collections,
      (o) => o.id == _targetCollectionId
    )!;

    item.id = uuidv4();
    item.modifyTime = datetime;
    collections[targetCollectionIndex].items.push(item);
    collections[targetCollectionIndex].modifyTime = datetime;

    let result = await Collections.update(collections);

    return result;
  }
}

export default CollectionItem;
