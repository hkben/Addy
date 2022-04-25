import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../../common/interface';
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

  let result = await syncProvider.sync();

  if (result) {
    Browser.runtime.sendMessage({
      action: 'syncCompleted',
    } as IBrowserMessage);
  }
};
