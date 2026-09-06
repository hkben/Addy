import { differenceInMinutes } from 'date-fns';
import Browser from 'webextension-polyfill';
import {
  BrowserMessageAction,
  IBrowserMessage,
  ICollection,
  ISyncSetting,
} from '@/common/interface';
import { Collections } from '@/common/storage';
import SyncSetting from '@/common/storage/syncSetting';
import AwsS3 from '@/common/sync/awsS3';
import GoogleDrive from '@/common/sync/googleDrive';
import SyncProvider from '@/common/sync/syncProvider';
import {
  createEncryptionKey,
  decryptPayload,
  encryptPayload,
  isPayloadEncrypted,
  unlockEncryptedPayload,
} from '@/common/sync/payloadEncryption';
import log from 'loglevel';

const sendMessage = (message: IBrowserMessage) => {
  Browser.runtime.sendMessage(message);
};

const updateStatus = (message: string) => {
  sendMessage({
    action: BrowserMessageAction.StatusUpdated,
    message,
  });
};

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

const getUploadPayload = async (syncSetting: ISyncSetting) => {
  const collections = await Collections.fetchAll();
  const payload = JSON.stringify(collections);

  if (syncSetting.encryptionEnabled == false) {
    log.debug('[Sync] Encryption is not enabled, returning plain payload.');

    return payload;
  }

  if (!syncSetting.encryptionKey || !syncSetting.encryptionSalt) {
    log.error(
      '[Sync] Encryption is enabled but encryption key or salt is missing.'
    );

    throw new Error(
      'Encrypted sync is locked. Unlock it in Sync settings before syncing.'
    );
  }

  return encryptPayload(
    payload,
    syncSetting.encryptionKey,
    syncSetting.encryptionSalt
  );
};

export const syncBackgroundRun = async () => {
  log.debug('[Sync] SyncBackground');

  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    sendMessage({
      action: BrowserMessageAction.SyncCompleted,
      result: false,
      message: 'Sync is disabled',
    });
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    log.error('[Sync] Sync Provider is undefined');

    sendMessage({
      action: BrowserMessageAction.SyncCompleted,
      result: false,
      message: 'Sync provider is not defined',
    });

    return;
  }

  //Sync Logic here

  let _result = false;
  let errorMessage = 'Sync failed';
  updateStatus('Initializing sync...');

  try {
    await syncProvider.init();

    updateStatus('Searching for remote sync file...');
    let fileInfo = await syncProvider.searchSyncFile();

    //If file is not exists on server, create one
    if (fileInfo == null || fileInfo.id == '') {
      updateStatus('Remote sync file not found. Creating a new one...');
      log.debug('[Sync] Remote Sync File is not exists, creating...');
      await syncProvider.createSyncFile(await getUploadPayload(_syncSetting));
    } else {
      updateStatus('Remote sync file found. Downloading...');
      log.debug('[Sync] Download Data...');
      let json = await syncProvider.getSyncFile(fileInfo);

      if (isPayloadEncrypted(json)) {
        updateStatus('Remote sync file is encrypted. Decrypting...');
        log.debug('[Sync] Payload is encrypted.');

        if (!_syncSetting.encryptionKey) {
          log.error(
            '[Sync] Encrypted sync is locked. Encryption key is missing.'
          );

          throw new Error(
            'Encrypted sync is locked. Unlock it in Sync settings before syncing or delete the remote file.'
          );
        }

        updateStatus('Decrypting payload...');
        json = await decryptPayload(json, _syncSetting.encryptionKey);

        updateStatus('Payload decrypted...');
        log.debug('[Sync] Payload decrypted.');
      }

      updateStatus('Importing Data...');
      log.debug('[Sync] Importing Data...');
      const collections: ICollection[] = JSON.parse(json);

      if (collections.length > 0) {
        await Collections.import(collections);
      }

      updateStatus('Removing Deleted Data...');
      log.debug('[Sync] Remove Deleted...');
      await Collections.removeDeleted();

      updateStatus('Uploading new data to remote sync file...');
      log.debug('[Sync] Uploading imported Data...');
      await syncProvider.updateSyncFile(
        fileInfo,
        await getUploadPayload(_syncSetting)
      );
    }

    let _datetime = new Date().toISOString();
    await SyncSetting.updateLastSyncTime(_datetime);

    log.info('[Sync] SyncBackground Done.');
    _result = true;
  } catch (error) {
    log.error('[Sync] Error...');
    log.error(error);
    errorMessage = error instanceof Error ? error.message : errorMessage;
  } finally {
    sendMessage({
      action: BrowserMessageAction.SyncCompleted,
      result: _result,
      message: _result ? undefined : errorMessage,
    });
  }
};

export const syncConnectionTest = async () => {
  log.debug('[Sync] SyncConnectionTest');

  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    sendMessage({
      action: BrowserMessageAction.SyncCompleted,
      result: false,
      message: 'Sync is disabled',
    });
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    log.error('[Sync] Sync Provider is undefined');

    sendMessage({
      action: BrowserMessageAction.SyncConnectionTestCompleted,
      result: false,
    });

    return;
  }

  //Test Logic here

  let _result = false;
  let errorMessage = 'Connection test failed';
  updateStatus('Initializing sync...');

  try {
    await syncProvider.init();

    updateStatus('Initializing connection test...');
    let testConnection = await syncProvider.connectionTest();

    if (testConnection) {
      _result = true;
    }

    log.info('[Sync] SyncConnectionTest Done.');
  } catch (error) {
    log.error('[Sync] Error...');
    log.error(error);
    errorMessage = error instanceof Error ? error.message : errorMessage;
  } finally {
    sendMessage({
      action: BrowserMessageAction.SyncConnectionTestCompleted,
      result: _result,
      message: _result ? undefined : errorMessage,
    });
  }
};

export const setSyncEncryption = async (password: string) => {
  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    sendMessage({
      action: BrowserMessageAction.SetSyncEncryptionCompleted,
      result: false,
      message: 'Sync is disabled',
    });
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    log.error('[Sync] Sync Provider is undefined');

    sendMessage({
      action: BrowserMessageAction.SetSyncEncryptionCompleted,
      result: false,
    });

    return;
  }

  // Main Logic

  log.debug('[Sync] Setting sync encryption with password.');

  let _result = false;
  let errorMessage = 'Failed to configure sync encryption';

  try {
    await syncProvider.init();

    var remoteKey = await retrieveKeyFromRemoteFile(syncProvider, password);

    if (remoteKey) {
      log.info('[Sync] Retrieved remote key from remote file.');

      _syncSetting.encryptionKey = remoteKey.encryptionKey;
      _syncSetting.encryptionSalt = remoteKey.encryptionSalt;
    } else {
      log.info('[Sync] No remote key found, creating a new one.');

      const key = await createEncryptionKey(password);
      _syncSetting.encryptionKey = key.storedKey;
      _syncSetting.encryptionSalt = key.storedSalt;
    }

    _syncSetting.encryptionEnabled = true;

    // Update the sync setting with the new encryption configuration
    await SyncSetting.update(_syncSetting);

    log.info('[Sync] Sync encryption configuration completed successfully.');

    _result = true;
  } catch (error) {
    log.error('[Sync] Error...');
    log.error(error);
    errorMessage = error instanceof Error ? error.message : errorMessage;
  } finally {
    sendMessage({
      action: BrowserMessageAction.SetSyncEncryptionCompleted,
      result: _result,
      message: _result ? undefined : errorMessage,
    });
  }
};

export const retrieveKeyFromRemoteFile = async (
  syncProvider: SyncProvider,
  password: string
) => {
  log.debug('[Sync] Retrieving key from remote file.');

  //Search for existing sync file
  const fileInfo = await syncProvider.searchSyncFile();

  if (!fileInfo?.id) {
    return undefined;
  }

  log.debug('[Sync] Found existing sync file with ID:', fileInfo.id);

  // If a sync file exists, attempt to retrieve and unlock it with the provided password.
  const remotePayload = await syncProvider.getSyncFile(fileInfo);

  if (isPayloadEncrypted(remotePayload) == false) {
    return undefined;
  }

  log.info('[Sync] File is encrypted. Unlocking with provided password.');

  const unlocked = await unlockEncryptedPayload(remotePayload, password);

  return {
    encryptionKey: unlocked.storedKey,
    encryptionSalt: unlocked.storedSalt,
  };
};

export const syncFileDeletion = async () => {
  log.debug('[Sync] SyncFileDeletion');

  let _syncSetting = await SyncSetting.fetch();

  if (_syncSetting.enable == false) {
    sendMessage({
      action: BrowserMessageAction.SyncFileDeletionCompleted,
      result: false,
      message: 'Sync is disabled',
    });
    return;
  }

  let syncProvider = getSyncProvider(_syncSetting.provider);

  if (syncProvider == undefined) {
    log.error('[Sync] Sync Provider is undefined');

    sendMessage({
      action: BrowserMessageAction.SyncFileDeletionCompleted,
      result: false,
      message: 'Sync provider is not defined',
    });

    return;
  }

  //Delete Logic here

  let _result = false;
  let errorMessage = 'Sync file deletion failed';
  updateStatus('Initializing sync...');

  try {
    await syncProvider.init();

    updateStatus('Searching for sync file...');
    let fileInfo = await syncProvider.searchSyncFile();

    if (fileInfo != null && fileInfo.id != '') {
      updateStatus('Deleting sync file...');
      log.debug('[Sync] Deleting...');
      await syncProvider.deleteSyncFile(fileInfo);
    }

    await SyncSetting.updateLastSyncTime();

    log.info('[Sync] SyncFileDeletion Done.');
    _result = true;
  } catch (error) {
    log.error('[Sync] Error...');
    log.error(error);
    errorMessage = error instanceof Error ? error.message : errorMessage;
  } finally {
    sendMessage({
      action: BrowserMessageAction.SyncFileDeletionCompleted,
      result: _result,
      message: _result ? undefined : errorMessage,
    });
  }
};

export const autoSyncChecking = async () => {
  log.debug('[Sync] autoSyncChecking');

  let _syncSetting = await SyncSetting.fetch();

  if (
    _syncSetting.enable == false ||
    _syncSetting.autoSyncInterval == 0 ||
    !_syncSetting.lastSyncTime
  ) {
    return;
  }

  let lasySyncDiff = differenceInMinutes(Date.now(), _syncSetting.lastSyncTime);

  if (lasySyncDiff >= _syncSetting.autoSyncInterval) {
    log.debug('[Sync] Run background sync');
    await syncBackgroundRun();
  }
};
