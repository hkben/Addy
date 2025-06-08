import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { Collections } from '../storage';
import { ICollection } from '../interface';
import SyncSetting from '../storage/syncSetting';
import ISyncProvider, { IFileInfo } from './syncProvider';

class awsS3 implements ISyncProvider {
  s3Client!: S3Client;
  bucketName!: string;
  region!: string;
  identityPoolId!: string;

  fileName: string = 'addy-sync.json';

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

    return;
  }

  async searchSyncFile(): Promise<IFileInfo> {
    let result: IFileInfo = {
      id: '',
      name: '',
      modifyTime: '',
    };

    let response = await this.s3Client.send(
      new ListObjectsV2Command({
        Prefix: this.fileName,
        Bucket: this.bucketName,
      })
    );

    if (response.Contents && response.Contents.length > 0) {
      let file = response.Contents[0];

      result.name = file.Key!;
      result.id = file.ETag!;
      result.modifyTime = file.LastModified!.toISOString();
    }

    return result;
  }

  async getSyncFile(_file: IFileInfo): Promise<string> {
    let result: string = '';

    let response = await this.s3Client.send(
      new GetObjectCommand({
        Key: _file.name,
        Bucket: this.bucketName,
        IfMatch: _file.id,
      })
    );

    if (response.Body) {
      const res = new Response(response.Body as BodyInit);
      result = await res.text();
    }

    return result;
  }

  async createSyncFile(): Promise<void> {
    let collections = await Collections.fetch();

    if (collections.length == 0) {
      return;
    }

    let _json = JSON.stringify(collections);

    const blob = new Blob([_json], { type: 'application/json' });

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: this.fileName,
        Body: blob,
      })
    );

    return;
  }

  async updateSyncFile(_file: IFileInfo): Promise<void> {
    this.createSyncFile(); //create new file with same name will replace old one
  }

  async deleteSyncFile(_file: IFileInfo): Promise<void> {
    let response = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: this.fileName,
      })
    );

    return;
  }

  async connectionTest(): Promise<boolean> {
    let response = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: this.bucketName,
      })
    );

    if (response.$metadata.httpStatusCode == 200) {
      return true;
    }

    return false;
  }
}

export default awsS3;
