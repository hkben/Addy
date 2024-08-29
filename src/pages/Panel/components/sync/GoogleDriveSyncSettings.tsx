import React, { Fragment, MouseEvent, useEffect } from 'react';
import GoogleOAuth from '../../../../common/auth/googleOAuth';
import { ISyncSetting } from '../../../../common/interface';
import SyncSetting from '../../../../common/storage/syncSetting';
import log from 'loglevel';

interface Prop {
  syncSetting: ISyncSetting;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

function GoogleDriveSyncSettings({ syncSetting, handleInputChange }: Prop) {
  const [settingState, setSettingState] = React.useState<ISyncSetting>(
    SyncSetting.init() as ISyncSetting
  );

  useEffect(() => {
    setSettingState(syncSetting);
  }, [syncSetting]);

  const handelLogin = async (event: MouseEvent) => {
    event.preventDefault();

    let authorizationCode = await GoogleOAuth.authentication();

    let token = await GoogleOAuth.getAccessToken(authorizationCode);
    let access_token = token.access_token;

    let userEmail = await GoogleOAuth.getUserInfo(access_token);

    let _syncSetting = syncSetting;
    _syncSetting.google_email = userEmail;
    _syncSetting.google_oAuthAccessToken = token.access_token;

    await SyncSetting.update(_syncSetting);

    setSettingState((prevState) => ({
      ...prevState,
      google_email: userEmail,
    }));
  };

  const handelLogout = async (event: MouseEvent) => {
    event.preventDefault();

    let _syncSetting = syncSetting;
    let access_token = _syncSetting.google_oAuthAccessToken || '';

    try {
      await GoogleOAuth.revoke(access_token);
    } catch (error) {
      log.error(error);
    }

    _syncSetting.google_email = undefined;
    _syncSetting.google_oAuthAccessToken = undefined;

    await SyncSetting.update(_syncSetting);

    setSettingState((prevState) => ({
      ...prevState,
      google_email: undefined,
    }));
  };

  return (
    <Fragment>
      <div className="w-2/3 flex h-28">
        <div className="w-2/3 my-auto">
          <p className="text-base font-bold">Google Login</p>
        </div>
        <div className="w-1/3 my-auto">
          {settingState.google_email ? (
            <span className="text-center">
              <p>{syncSetting.google_email}</p>
              <p>
                <a className="underline cursor-pointer" onClick={handelLogout}>
                  Logout
                </a>
              </p>
            </span>
          ) : (
            <a className="cursor-pointer m-auto" onClick={handelLogin}>
              <img className="m-auto" src="../img/sign_in_with_google.png" />
            </a>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default GoogleDriveSyncSettings;
