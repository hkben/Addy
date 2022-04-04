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
  _content: string = ''
): ICollectionSummary {
  let summary: ICollectionSummary = {
    id: _collection.id,
    name: _collection.name,
    items: _collection.items.length,
    createTime: _collection.createTime,
    modifyTime: _collection.modifyTime,
  };

  if (_content != '') {
    let findExits = _.filter(
      _collection.items,
      (i) => i.content.toLowerCase() == _content.toLowerCase()
    );

    summary.isExists = findExits.length > 0 ? true : false;
  }

  return summary;
}

export interface ICollectionItem extends DataDateTime {
  id: string;
  content: string;
  type: string;
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
  installedVersion: string;
  collections: ICollection[];
  setting: ISetting;
}

//Setting
export interface ISetting {
  collectionsOrdering: IOrdering;
  quickSearch: boolean;
  darkMode: boolean;
  viewingOption: IViewingOption;
}

export interface IOrdering {
  type: SortElement;
  descending: boolean;
}

export enum SortElement {
  Default = 0,
  Name = 1,
  CreateTime = 2,
  ModifyTime = 3,
  Items = 4,
}

export interface IViewingOption {
  hiddenColumns: string[];
  spacing: string;
  imageColumns: number;
}
