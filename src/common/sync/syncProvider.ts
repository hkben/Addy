export interface IFileInfo {
  id: string; // ETag in S3
  name: string;
  modifyTime: string; //ISOString
}

export default interface ISyncProvider {
  init(): Promise<boolean>;
  searchSyncFile(): Promise<IFileInfo>;
  createSyncFile(): Promise<boolean>;
  getSyncFile(_file: IFileInfo): Promise<string>;
}
