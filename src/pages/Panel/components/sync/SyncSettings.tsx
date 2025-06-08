import { formatISO, formatDistanceToNow } from 'date-fns';
import React, { useEffect } from 'react';
import { ISyncSetting } from '@/common/interface';
import SyncSetting from '@/common/storage/syncSetting';
import AwsS3SyncSettings from './AwsS3SyncSettings';
import GoogleDriveSyncSettings from './GoogleDriveSyncSettings';
import SyncButton from './SyncButton';
import SyncDeleteButton from './SyncDeleteButton';
import SyncConnectionTestButton from './SyncTestConnectionButton';
import log from 'loglevel';

function SyncSettings() {
  const [syncSetting, setSyncSetting] = React.useState<ISyncSetting>(
    SyncSetting.init() as ISyncSetting
  );

  const getSyncSetting = async () => {
    let _syncSetting = await SyncSetting.fetch();
    setSyncSetting(_syncSetting);
  };

  useEffect(() => {
    getSyncSetting().catch(log.error);
  }, []);

  const handleSyncingCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.checked;

    let _syncSetting = syncSetting;
    _syncSetting.enable = value;

    await SyncSetting.update(_syncSetting);

    setSyncSetting((prevState) => ({
      ...prevState,
      enable: value,
    }));
  };

  const handleProviderSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.currentTarget.value;

    let _syncSetting = SyncSetting.init();
    _syncSetting.enable = true;
    _syncSetting.provider = value;

    await SyncSetting.update(_syncSetting);

    setSyncSetting(_syncSetting);
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let saveSetting = event.type == 'blur' ? true : false;

    let name = event.currentTarget.name;
    let value = event.currentTarget.value;

    let _syncSetting = syncSetting;

    switch (name) {
      case 'autoSyncInterval':
        _syncSetting.autoSyncInterval = parseInt(value);
        break;

      case 'awsS3_Region':
        _syncSetting.awsS3_Region = value;
        break;
      case 'awsS3_BucketName':
        _syncSetting.awsS3_BucketName = value;
        break;
      case 'awsS3_IdentityPoolId':
        _syncSetting.awsS3_IdentityPoolId = value;
        break;

      default:
        break;
    }

    if (saveSetting) {
      await SyncSetting.update(_syncSetting);
    }

    setSyncSetting((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const syncProviderSetting = () => {
    if (syncSetting == null) {
      return '';
    }

    switch (syncSetting.provider) {
      case 'awsS3':
        return (
          <AwsS3SyncSettings
            handleInputChange={handleInputChange}
            syncSetting={syncSetting}
          />
        );
      case 'googleDrive':
        return (
          <GoogleDriveSyncSettings
            handleInputChange={handleInputChange}
            syncSetting={syncSetting}
          />
        );

      default:
        return '';
    }
  };

  return (
    <div>
      <p className="text-3xl py-2">Syncing</p>
      <div className="w-full text-sm divide-y">
        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Enable Syncing</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <input
              type="checkbox"
              className="w-6 h-6 border border-gray-200 rounded-lg"
              checked={syncSetting.enable ? true : false}
              onChange={handleSyncingCheckbox}
            />
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Background Sync</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <SyncButton callbackAfterSync={getSyncSetting} />
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">
              Auto Sync Interval From Last Sync (Minutes)
            </p>
            <p>0 = Disable</p>
            <p>Background checking only runs every 10 minutes.</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <input
              name="autoSyncInterval"
              type="number"
              className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              placeholder="Minutes"
              value={syncSetting.autoSyncInterval || 0}
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Last Sync Time</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            {syncSetting.lastSyncTime ? (
              <span>
                <p>{formatDistanceToNow(syncSetting.lastSyncTime) + ' ago'}</p>
                <p>{formatISO(syncSetting.lastSyncTime)}</p>
              </span>
            ) : (
              <span>None</span>
            )}
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Provider</p>
            <p>
              Please read{' '}
              <a
                className="underline"
                href="https://github.com/hkben/Addy/wiki/Sync"
              >
                wiki
              </a>{' '}
              for more information
            </p>
          </div>
          <div className="w-1/3 my-auto">
            <select
              className="h-10 px-4 w-full border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              id="spaceing"
              value={syncSetting.provider ? syncSetting.provider : 0}
              onChange={handleProviderSelection}
            >
              <option value="">----</option>
              <option value="googleDrive">Google Drive</option>
              <option value="awsS3">AWS S3</option>
            </select>
          </div>
        </div>

        {syncProviderSetting()}

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Connection Test</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <SyncConnectionTestButton />
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Delete Sync File on Server</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <SyncDeleteButton callbackAfterSync={getSyncSetting} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyncSettings;
