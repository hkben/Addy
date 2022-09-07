import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection } from '../interface';
import Collections from './collections';
import Storage from './storage';

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
    _content: string
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

    collections[collectionIndex].items[itemIndex].content = _content;
    collections[collectionIndex].items[itemIndex].modifyTime = datetime;
    collections[collectionIndex].modifyTime = datetime;

    let result = await Collections.update(collections);

    return { result, datetime };
  }
}

export default CollectionItem;
