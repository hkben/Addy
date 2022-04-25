import moment from 'moment';
import React, { useEffect } from 'react';
import Browser from 'webextension-polyfill';
import Google from '../../../../common/auth/google';
import { IBrowserMessage, ISyncSetting } from '../../../../common/interface';
import SyncSetting from '../../../../common/storage/syncSetting';

function SyncSettings() {
  const [syncSetting, setSyncSetting] = React.useState<ISyncSetting>(
    SyncSetting.init() as ISyncSetting
  );

  const [syncing, setSyncing] = React.useState<boolean>(false);

  const getSyncSetting = async () => {
    let _syncSetting = await SyncSetting.fetch();
    setSyncSetting(_syncSetting);
  };

  const handleBackgroundSync = async () => {
    if (syncing) {
      return;
    }

    Browser.runtime.sendMessage({
      action: 'SyncBackgroundRun',
    } as IBrowserMessage);

    setSyncing(true);
  };

  const onMessageListener = (packet: IBrowserMessage, sender: any) => {
    console.log('onMessageListener');

    if (packet.action == 'syncCompleted') {
      setSyncing(false);
      getSyncSetting().catch(console.error);
    }
  };

  useEffect(() => {
    getSyncSetting().catch(console.error);

    Browser.runtime.onMessage.addListener(onMessageListener);
    return () => {
      Browser.runtime.onMessage.addListener(onMessageListener);
    };
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

    let _syncSetting = syncSetting;
    _syncSetting.provider = value;

    await SyncSetting.update(_syncSetting);

    setSyncSetting((prevState) => ({
      ...prevState,
      provider: value,
    }));
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let saveSetting = event.type == 'blur' ? true : false;

    let name = event.currentTarget.name;
    let value = event.currentTarget.value;

    let _syncSetting = syncSetting;

    switch (name) {
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
            <p className="text-base font-bold">Provider</p>
          </div>
          <div className="w-1/3 my-auto">
            <select
              className="h-10 px-4 w-full border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              id="spaceing"
              value={syncSetting.provider ? syncSetting.provider : 0}
              onChange={handleProviderSelection}
            >
              <option value="">----</option>
              <option value="awsS3">AWS S3</option>
            </select>
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">AWS Region</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <input
              name="awsS3_Region"
              className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              placeholder="Region"
              value={syncSetting.awsS3_Region || ''}
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">AWS S3 Bucket Name</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <input
              name="awsS3_BucketName"
              className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              placeholder="Bucket Name"
              value={syncSetting.awsS3_BucketName || ''}
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">AWS Identity Pool Id</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <input
              name="awsS3_IdentityPoolId"
              className="w-full placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              placeholder="Identity Pool Id"
              value={syncSetting.awsS3_IdentityPoolId || ''}
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
                <p>{moment(syncSetting.lastSyncTime).fromNow()}</p>
                <p>{moment(syncSetting.lastSyncTime).format()}</p>
              </span>
            ) : (
              <span>None</span>
            )}
          </div>
        </div>

        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Background Sync</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <button
              className="flex mx-auto p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
              onClick={handleBackgroundSync}
            >
              {syncing ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-spin h-5 w-5 inline mx-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#bbb"
                      fill="none"
                      strokeWidth={3}
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeDashoffset="100"
                      strokeDasharray="50"
                      strokeWidth={3}
                    />
                  </svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <span>Sync Now</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyncSettings;
