export interface IFileInfo {
  id: string; // ETag in S3
  name: string;
  modifyTime: string; //ISOString
}

export default interface ISyncProvider {
  sync(): Promise<boolean>;
}
