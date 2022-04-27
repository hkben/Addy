export interface IFileInfo {
  id: string; // ETag in S3
  name: string;
  modifyTime: string; //ISOString
}

export default interface ISyncProvider {
  init(): Promise<void>;
  searchSyncFile(): Promise<IFileInfo>;
  createSyncFile(): Promise<void>;
  getSyncFile(_file: IFileInfo): Promise<string>;
  connectionTest(): Promise<boolean>;
}
