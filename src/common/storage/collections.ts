import _ from 'lodash';
import Browser from 'webextension-polyfill';
import {
  CastSummary,
  ICollection,
  ICollectionSummary,
  IStorage,
} from '../interface';
import { isValid, parseISO, differenceInDays } from 'date-fns';
import Storage from './storage';
import log from 'loglevel';

class Collections {
  static async fetchAll(): Promise<ICollection[]> {
    let collections: ICollection[] = [];

    try {
      //It returns {collections}, so IStorage is better choice, not ICollection[]
      let localStorage = (await Browser.storage.local.get(
        'collections'
      )) as IStorage;

      if (typeof localStorage.collections == 'undefined') {
        throw new Error('[Collections] localStorage.collections undefined');
      }

      collections = localStorage.collections;
    } catch (e) {
      log.error(e);
    }
    return collections;
  }

  static async fetchSummary(
    _text: string = '',
    _includeDeleted: boolean = false
  ): Promise<ICollectionSummary[]> {
    let collections = await this.fetchAll();
    let summary = collections.map((o) => CastSummary(o, _text));

    if (_includeDeleted == false) {
      summary = _.filter(summary, (o) => o.deleted == undefined);
    }

    return summary;
  }

  static async update(_collections: ICollection[]): Promise<boolean> {
    const collections = _collections;
    try {
      await Browser.storage.local.set({ collections });
    } catch (e) {
      log.error(e);
      return false;
    }

    return true;
  }

  static async import(_importCollections: ICollection[]) {
    try {
      let collections = await this.fetchAll();

      _importCollections.forEach((importCollection) => {
        //find if collection if exists
        let collectionIndex = _.findIndex(
          collections,
          (o) => o.id == importCollection.id
        )!;

        if (collectionIndex == -1) {
          collections.push(importCollection);
          return;
        }

        let collection = collections[collectionIndex];

        //Add createTime and modifyTime to collection if not valid
        if (isValid(parseISO(importCollection.createTime)) == false) {
          collection.createTime = new Date().toISOString();
        }

        if (isValid(parseISO(importCollection.modifyTime)) == false) {
          collection.modifyTime = new Date().toISOString();
        }

        if (importCollection.modifyTime > collection.modifyTime) {
          //if import one is newer
          collection.modifyTime = importCollection.modifyTime;
          collection.name = importCollection.name;
          collection.deleted = importCollection.deleted;
          collection.color = importCollection.color;
        }

        importCollection.items.forEach((importItem) => {
          //find if item if exists in collection
          let itemIndex = _.findIndex(
            collection.items,
            (o) => o.id == importItem.id
          )!;

          //Add createTime and modifyTime to item if not valid
          if (isValid(parseISO(importItem.createTime)) == false) {
            importItem.createTime = new Date().toISOString();
          }

          if (isValid(parseISO(importItem.modifyTime)) == false) {
            importItem.modifyTime = new Date().toISOString();
          }

          if (itemIndex == -1) {
            collection.items.push(importItem);
            return;
          }

          if (importItem.modifyTime > collection.items[itemIndex].modifyTime) {
            //if import one is newer
            //Replace item if exists
            collection.items[itemIndex] = importItem;
          }
        });
      });

      await this.update(collections);
    } catch (e) {
      return false;
    }
    return true;
  }

  static async restore() {
    let collections = await this.fetchAll();

    let datetime = new Date().toISOString();

    collections.forEach((collection) => {
      let restored = false;

      collection.items.forEach((item) => {
        if (item.deleted) {
          item.deleted = undefined;
          item.modifyTime = datetime;
          restored = true;
        }
      });

      if (collection.deleted || restored) {
        collection.deleted = undefined;
        collection.modifyTime = datetime;
      }
    });

    let result = await this.update(collections);

    return result;
  }

  static async removeDeleted(_manualRun: boolean = false) {
    let dayRange = 30; // 30 Days

    if (_manualRun) {
      dayRange = -1; // All
    }

    let collections = await this.fetchAll();

    let collectionsToRemove: number[] = [];

    collections.forEach((collection, collectionIndex) => {
      let itemsToRemove: number[] = [];

      collection.items.forEach((item, itemIndex) => {
        if (item.deleted) {
          let deletedDays = differenceInDays(Date.now(), item.deleted);

          if (deletedDays >= dayRange) {
            itemsToRemove.push(itemIndex);
          }
        }
      });

      _.pullAt(collections[collectionIndex].items, itemsToRemove);

      if (collection.deleted) {
        let deletedDays = differenceInDays(Date.now(), collection.deleted);

        if (deletedDays >= dayRange) {
          collectionsToRemove.push(collectionIndex);
        }
      }
    });

    _.pullAt(collections, collectionsToRemove);

    let result = await this.update(collections);

    return result;
  }

  //for Migration only
  static async updateDeletedToDateTime() {
    let collections = await this.fetchAll();

    if (collections.length <= 0) {
      return;
    }

    let datetime = new Date().toISOString();

    collections.forEach((collection) => {
      let restored = false;

      collection.items.forEach((item) => {
        if (item.deleted != undefined) {
          item.deleted = datetime;
          item.modifyTime = datetime;
          restored = true;
        }
      });

      if (restored) {
        collection.modifyTime = datetime;
      }

      if (collection.deleted != undefined) {
        collection.deleted = datetime;
        collection.modifyTime = datetime;
      }
    });

    let result = await this.update(collections);

    return result;
  }
}

export default Collections;
