//BrowserMessage
export interface IBrowserMessage {
  action: string;
  imageSrc?: string;
}

//Collectiom
export interface ICollection {
  id: string;
  name: string;
  items: ICollectionItem[];
}

export interface ICollectionItem extends DataDateTime {
  id: string;
  text: string;
  source: string;
}

interface DataDateTime {
  createTime: Date;
  modifyTime: Date;
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
}
