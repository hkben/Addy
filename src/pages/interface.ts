import _ from 'lodash';

//BrowserMessage
export interface IBrowserMessage {
  action: string;
  imageSrc?: string;
}

//Collectiom
export interface ICollection extends DataDateTime {
  id: string;
  name: string;
  items: ICollectionItem[];
}

export function CastSummary(
  _collection: ICollection,
  _text: string = ''
): ICollectionSummary {
  let summary: ICollectionSummary = {
    id: _collection.id,
    name: _collection.name,
    items: _collection.items.length,
    createTime: _collection.createTime,
    modifyTime: _collection.modifyTime,
  };

  if (_text != '') {
    let findExits = _.filter(
      _collection.items,
      (i) => i.text.toLowerCase() == _text.toLowerCase()
    );

    summary.isExists = findExits.length > 0 ? true : false;
  }

  return summary;
}

export interface ICollectionItem extends DataDateTime {
  id: string;
  text: string;
  source: string;
}

interface DataDateTime {
  createTime: string; //ISOString
  modifyTime: string; //ISOString
}

export interface ICollectionSummary extends DataDateTime {
  id: string;
  name: string;
  items: number;
  isExists?: boolean;
}

//Option
export interface IOption {
  darkmode: boolean;
  endpoint: string;
  token: string;
  key: string;
}

//Storage
export interface IStorage {
  // isInstalled: boolean;
  collections: ICollection[];
  setting: ISetting;
}

//Setting
export interface ISetting {
  collectionsOrdering: Ordering;
  quickSearch: boolean;
}

export interface Ordering {
  type: SortElement;
  descending: boolean;
}

export enum SortElement {
  Default = 0,
  Name = 1,
  Items = 2,
  CreateTime = 3,
  ModifyTime = 4,
}
