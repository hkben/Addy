export interface IFileInfo {
  id: string; // ETag in S3
  name: string;
  modifyTime: string; //ISOString
}

export default interface ISyncProvider {
  init(): Promise<void>;
  searchSyncFile(): Promise<IFileInfo>;
  createSyncFile(): Promise<void>;
  updateSyncFile(_file: IFileInfo): Promise<void>;
  getSyncFile(_file: IFileInfo): Promise<string>;
  deleteSyncFile(_file: IFileInfo): Promise<void>;
  connectionTest(): Promise<boolean>;
}
