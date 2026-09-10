import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from '@aws-sdk/client-cognito-identity';
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

    const cognito = new CognitoIdentityClient({ region: this.region });

    const { IdentityId } = await cognito.send(
      new GetIdCommand({ IdentityPoolId: this.identityPoolId })
    );

    const { Credentials } = await cognito.send(
      new GetCredentialsForIdentityCommand({ IdentityId })
    );

    if (
      !Credentials ||
      !Credentials.AccessKeyId ||
      !Credentials.SecretKey ||
      !Credentials.SessionToken ||
      !Credentials.Expiration
    ) {
      throw new Error('Cognito did not return valid AWS credentials.');
    }

    this.s3Client = new S3Client({
      region: this.region,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      credentials: {
        accessKeyId: Credentials!.AccessKeyId!,
        secretAccessKey: Credentials!.SecretKey!,
        sessionToken: Credentials!.SessionToken!,
        expiration: Credentials!.Expiration!,
      },
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

  async createSyncFile(payload: string): Promise<void> {
    if (!payload) {
      return;
    }

    const blob = new Blob([payload], { type: 'application/json' });

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: this.fileName,
        Body: blob,
      })
    );

    return;
  }

  async updateSyncFile(_file: IFileInfo, payload: string): Promise<void> {
    await this.createSyncFile(payload); //create new file with same name will replace old one
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
