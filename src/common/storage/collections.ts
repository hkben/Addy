import _ from 'lodash';
import Browser from 'webextension-polyfill';
import {
  CastSummary,
  ICollection,
  ICollectionSummary,
  IStorage,
} from '../interface';
import moment, { ISO_8601 } from 'moment';
import Storage from './storage';

class Collections {
  static async fetch(): Promise<ICollection[]> {
    let collections: ICollection[] = [];

    try {
      //It returns {collections}, so IStorage is better choice, not ICollection[]
      let localStorage = (await Browser.storage.local.get(
        'collections'
      )) as IStorage;

      collections = localStorage.collections;
    } catch (e) {
      console.error(e);
    }
    return collections;
  }

  static async fetchSummary(_text: string = ''): Promise<ICollectionSummary[]> {
    let collections = await this.fetch();
    let summary = collections.map((o) => CastSummary(o, _text));
    return summary;
  }

  static async update(_collections: ICollection[]): Promise<boolean> {
    const collections = _collections;
    try {
      await Browser.storage.local.set({ collections });
    } catch (e) {
      console.error(e);
      return false;
    }

    return true;
  }

  static async import(_collections: ICollection[]) {
    try {
      let localStorage = await Storage.fetch();

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
}

export default Collections;
