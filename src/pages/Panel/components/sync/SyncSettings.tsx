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
import { useSyncStore } from '@/common/store/useSyncStore';
import SettingItem from '../settings/SettingItem';

function SyncSettings() {
  const lastSyncTime = useSyncStore((state) => state.lastSyncTime);

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
      <div className="grid gap-1 mb-4">
        <p className="text-3xl font-bold py-2">Syncing</p>
        <p className="text-muted-foreground">
          Syncing settings for the application
        </p>
      </div>

      <div className="w-full text-sm divide-y">
        <SettingItem
          title="Syncing"
          description="Enable or disable syncing of collections and items."
        >
          <input
            type="checkbox"
            className="w-6 h-6 border border-gray-200 rounded-lg"
            checked={syncSetting.enable ? true : false}
            onChange={handleSyncingCheckbox}
          />
        </SettingItem>

        <SettingItem title="Background Sync">
          <SyncButton />
        </SettingItem>

        <SettingItem
          title=" Auto Sync Interval From Last Sync (Minutes)"
          description="0 = Disable , Background checking only runs every 10 minutes."
        >
          <input
            name="autoSyncInterval"
            type="number"
            className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            placeholder="Minutes"
            value={syncSetting.autoSyncInterval || 0}
            onChange={handleInputChange}
            onBlur={handleInputChange}
          />
        </SettingItem>

        <SettingItem title="Last Sync Time">
          {lastSyncTime ? (
            <span>
              <p>
                {formatDistanceToNow(lastSyncTime, {
                  addSuffix: true,
                })}
              </p>
              <p>{formatISO(lastSyncTime)}</p>
            </span>
          ) : (
            <span>None</span>
          )}
        </SettingItem>

        <SettingItem
          title="Provider"
          description={
            <span>
              Please read{' '}
              <a
                className="underline"
                href="https://github.com/hkben/Addy/wiki/Sync"
              >
                wiki
              </a>{' '}
              for more information
            </span>
          }
        >
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
        </SettingItem>

        {syncProviderSetting()}

        <SettingItem title="Connection Test">
          <SyncConnectionTestButton />
        </SettingItem>

        <SettingItem title="Delete Sync File on Server">
          <SyncDeleteButton />
        </SettingItem>
      </div>
    </div>
  );
}

export default SyncSettings;
