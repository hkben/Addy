import _ from 'lodash';

//BrowserMessage
export interface IBrowserMessage {
  action: string;
  imageSrc?: string;
  result?: boolean;
}

//Collectiom
export interface ICollection extends DataDateTime {
  id: string;
  name: string;
  items: ICollectionItem[];
  color?: number;
  deleted?: string; //ISOString
}

export function CastSummary(
  _collection: ICollection,
  _content: string = ''
): ICollectionSummary {
  let _items = _.filter(_collection.items, (o) => o.deleted == undefined);

  let summary: ICollectionSummary = {
    id: _collection.id,
    name: _collection.name,
    items: _items.length,
    color: _collection.color,
    createTime: _collection.createTime,
    modifyTime: _collection.modifyTime,
    deleted: _collection.deleted,
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
  deleted?: string; //ISOString
}

interface DataDateTime {
  createTime: string; //ISOString
  modifyTime: string; //ISOString
}

export interface ICollectionSummary extends DataDateTime {
  id: string;
  name: string;
  items: number;
  color?: number;
  isExists?: boolean;
  deleted?: string; //ISOString
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
  syncSetting: ISyncSetting;
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

//Sync Setting
export interface ISyncSetting {
  enable: boolean;
  lastSyncTime: string;
  provider: string;
  awsS3_Region?: string;
  awsS3_BucketName?: string;
  awsS3_IdentityPoolId?: string;
}
