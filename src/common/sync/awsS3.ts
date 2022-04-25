import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { Collections } from '../storage';
import { ICollection } from '../interface';
import SyncSetting from '../storage/syncSetting';
import moment from 'moment';
import ISyncProvider, { IFileInfo } from './syncProvider';

class awsS3 implements ISyncProvider {
  s3Client!: S3Client;
  bucketName!: string;
  region!: string;
  identityPoolId!: string;

  fileName: string = 'addy-sync.json';
  syncFileInfo?: IFileInfo;

  constructor() {
    this.init().catch(console.error);
  }

  async init(): Promise<void> {
    let _syncSetting = await SyncSetting.fetch();

    this.bucketName = _syncSetting.awsS3_BucketName || '';
    this.region = _syncSetting.awsS3_Region || '';
    this.identityPoolId = _syncSetting.awsS3_IdentityPoolId || '';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: this.region }),
        identityPoolId: this.identityPoolId,
      }),
    });
  }

  async sync(): Promise<boolean> {
    let _syncSetting = await SyncSetting.fetch();

    await this.searchSyncFile();

    //If file is not exists on server, create one
    if (this.syncFileInfo == null) {
      console.log('[Sync] Remote Sync File is not exists, creating...');
      await this.createSyncFile();
    }

    //If file on server is older than local, upload local data
    if (
      moment(_syncSetting.lastSyncTime).isSameOrAfter(
        this.syncFileInfo!.modifyTime!
      )
    ) {
      console.log('[Sync] Local Data is newer, uploading...');
      await this.createSyncFile();
    } else {
      console.log('[Sync] Remote Data is newer, download...');

      let json = await this.getSyncFile();
      console.log('[Sync] Importing Data...');

      const collections: ICollection[] = JSON.parse(json);
      await Collections.import(collections);

      console.log('[Sync] Uploading imported Data...');
      await this.createSyncFile();
    }

    let _datetime = new Date().toISOString();
    await SyncSetting.updateLastSyncTime(_datetime);

    console.log('[Sync] Done...');

    return true;
  }

  async searchSyncFile(): Promise<boolean> {
    try {
      let response = await this.s3Client.send(
        new ListObjectsV2Command({
          Prefix: this.fileName,
          Bucket: this.bucketName,
        })
      );

      if (response.Contents && response.Contents.length > 0) {
        let file = response.Contents[0];

        this.syncFileInfo = {
          name: file.Key!,
          id: file.ETag!,
          modifyTime: file.LastModified!.toISOString(),
        };
      }
    } catch (e) {
      console.error(e);
      return false;
    }

    return true;
  }

  async getSyncFile(): Promise<string> {
    let result: string = '';

    try {
      let response = await this.s3Client.send(
        new GetObjectCommand({
          Key: this.syncFileInfo!.name,
          Bucket: this.bucketName,
          IfMatch: this.syncFileInfo!.id,
        })
      );

      if (response.Body) {
        const res = new Response(response.Body as BodyInit);
        result = await res.text();
      }
    } catch (e) {
      console.error(e);
    }

    return result;
  }

  async createSyncFile(): Promise<boolean> {
    let collections = await Collections.fetch();
    let _json = JSON.stringify(collections);

    const blob = new Blob([_json], { type: 'application/json' });

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: this.fileName,
          Body: blob,
        })
      );
    } catch (e) {
      console.error(e);
      return false;
    }

    return true;
  }
}

export default awsS3;
