import moment from 'moment';
import Browser from 'webextension-polyfill';
import { IBrowserMessage, ICollection } from '../../../common/interface';
import { Collections } from '../../../common/storage';
import SyncSetting from '../../../common/storage/syncSetting';
import AwsS3 from '../../../common/sync/awsS3';
import SyncProvider from '../../../common/sync/syncProvider';

export const getSyncProvider = (
  _provider: string
): SyncProvider | undefined => {
  switch (_provider) {
    case 'awsS3':
      return new AwsS3();
    default:
      return undefined;
  }
};

export const syncBackgroundRun = async () => {
  console.log('[Sync] SyncBackground');

  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    console.error('[Sync] Sync Provider is undefined');
    return;
  }

  //Sync Logic here
  let init = await syncProvider.init();
  let fileInfo = await syncProvider.searchSyncFile();

  //If file is not exists on server, create one
  if (fileInfo == null) {
    console.log('[Sync] Remote Sync File is not exists, creating...');
    await syncProvider.createSyncFile();
  }

  console.log('[Sync] Download Data...');
  let json = await syncProvider.getSyncFile(fileInfo);

  console.log('[Sync] Importing Data...');
  const collections: ICollection[] = JSON.parse(json);

  if (collections.length > 0) {
    await Collections.import(collections);
  }

  console.log('[Sync] Uploading imported Data...');
  await syncProvider.createSyncFile();

  let _datetime = new Date().toISOString();
  await SyncSetting.updateLastSyncTime(_datetime);

  console.log('[Sync] Done...');

  Browser.runtime.sendMessage({
    action: 'syncCompleted',
  } as IBrowserMessage);
};
