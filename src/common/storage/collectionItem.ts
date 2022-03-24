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

    _.remove(collections[collectionIndex].items, (o) => o.id == _itemId);

    let result = await Collections.update(collections);

    return result;
  }
}

export default CollectionItem;
