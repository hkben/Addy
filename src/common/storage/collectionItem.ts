import _ from 'lodash';
import Browser from 'webextension-polyfill';
import { ICollection } from '../../pages/interface';
import Storage from './storage';

class CollectionItem {
  static async delete(_collectionId: string, _itemId: string) {
    try {
      let localStorage = await Storage.fetch();
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
}

export default CollectionItem;
