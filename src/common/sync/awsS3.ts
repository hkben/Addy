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

  async init(): Promise<boolean> {
    try {
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
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  async searchSyncFile(): Promise<IFileInfo> {
    let result: IFileInfo = {
      id: '',
      name: '',
      modifyTime: '',
    };

    try {
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
    } catch (e) {
      console.error(e);
      return result;
    }

    return result;
  }

  async getSyncFile(_file: IFileInfo): Promise<string> {
    let result: string = '';

    try {
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
