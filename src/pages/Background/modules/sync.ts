import moment from 'moment';
import Browser from 'webextension-polyfill';
import { IBrowserMessage, ICollection } from '../../../common/interface';
import { Collections } from '../../../common/storage';
import SyncSetting from '../../../common/storage/syncSetting';
import AwsS3 from '../../../common/sync/awsS3';
import GoogleDrive from '../../../common/sync/googleDrive';
import SyncProvider from '../../../common/sync/syncProvider';
import log from 'loglevel';

export const getSyncProvider = (
  _provider: string
): SyncProvider | undefined => {
  switch (_provider) {
    case 'awsS3':
      return new AwsS3();
    case 'googleDrive':
      return new GoogleDrive();
    default:
      return undefined;
  }
};

export const syncBackgroundRun = async () => {
  log.trace('[Sync] SyncBackground');

  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    log.error('[Sync] Sync Provider is undefined');

    Browser.runtime.sendMessage({
      action: 'SyncCompleted',
      result: false,
    } as IBrowserMessage);

    return;
  }

  //Sync Logic here

  let _result = false;

  try {
    await syncProvider.init();

    let fileInfo = await syncProvider.searchSyncFile();

    //If file is not exists on server, create one
    if (fileInfo == null || fileInfo.id == '') {
      log.trace('[Sync] Remote Sync File is not exists, creating...');
      await syncProvider.createSyncFile();
    } else {
      log.trace('[Sync] Download Data...');
      let json = await syncProvider.getSyncFile(fileInfo);

      log.trace('[Sync] Importing Data...');
      const collections: ICollection[] = JSON.parse(json);

      if (collections.length > 0) {
        await Collections.import(collections);
      }

      log.trace('[Sync] Remove Deleted...');
      await Collections.removeDeleted();

      log.trace('[Sync] Uploading imported Data...');
      await syncProvider.updateSyncFile(fileInfo);
    }

    let _datetime = new Date().toISOString();
    await SyncSetting.updateLastSyncTime(_datetime);

    log.info('[Sync] SyncBackground Done.');
    _result = true;
  } catch (error) {
    log.error('[Sync] Error...');
    log.error(error);
  } finally {
    Browser.runtime.sendMessage({
      action: 'SyncCompleted',
      result: _result,
    } as IBrowserMessage);
  }
};

export const syncConnectionTest = async () => {
  log.trace('[Sync] SyncConnectionTest');

  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    log.error('[Sync] Sync Provider is undefined');

    Browser.runtime.sendMessage({
      action: 'SyncConnectionTestCompleted',
      result: false,
    } as IBrowserMessage);

    return;
  }

  //Test Logic here

  let _result = false;

  try {
    await syncProvider.init();

    let testConnection = await syncProvider.connectionTest();

    if (testConnection) {
      _result = true;
    }

    log.info('[Sync] SyncConnectionTest Done.');
  } catch (error) {
    log.error('[Sync] Error...');
    log.error(error);
  } finally {
    Browser.runtime.sendMessage({
      action: 'SyncConnectionTestCompleted',
      result: _result,
    } as IBrowserMessage);
  }
};

export const syncFileDeletion = async () => {
  log.trace('[Sync] SyncFileDeletion');

  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    log.error('[Sync] Sync Provider is undefined');

    Browser.runtime.sendMessage({
      action: 'SyncFileDeletionCompleted',
      result: false,
    } as IBrowserMessage);

    return;
  }

  //Delete Logic here

  let _result = false;

  try {
    await syncProvider.init();

    let fileInfo = await syncProvider.searchSyncFile();

    if (fileInfo != null && fileInfo.id != '') {
      log.trace('[Sync] Deleting...');
      await syncProvider.deleteSyncFile(fileInfo);
    }

    await SyncSetting.updateLastSyncTime();

    log.info('[Sync] SyncFileDeletion Done.');
    _result = true;
  } catch (error) {
    log.error('[Sync] Error...');
    log.error(error);
  } finally {
    Browser.runtime.sendMessage({
      action: 'SyncFileDeletionCompleted',
      result: _result,
    } as IBrowserMessage);
  }
};

export const autoSyncChecking = async () => {
  log.trace('[Sync] autoSyncChecking');

  let _syncSetting = await SyncSetting.fetch();

  if (
    _syncSetting.enable == false ||
    _syncSetting.autoSyncInterval == 0 ||
    !_syncSetting.lastSyncTime
  ) {
    return;
  }

  let lasySyncDiff = moment().diff(_syncSetting.lastSyncTime, 'minutes');

  if (lasySyncDiff >= _syncSetting.autoSyncInterval) {
    log.trace('[Sync] Run background sync');
    await syncBackgroundRun();
  }
};
