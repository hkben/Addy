import React, { useEffect } from 'react';

import { BrowserMessageAction, ISyncSetting } from '@/common/interface';
import { Button } from '@/components/ui/button';
import SyncSetting from '@/common/storage/syncSetting';
import SettingItem from '../SettingItem';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';
import { CloudAlertIcon, KeyRound, RefreshCwIcon } from 'lucide-react';

interface Prop {
  syncSetting: ISyncSetting;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

function SyncEncryptionSetting({ syncSetting, handleInputChange }: Prop) {
  const [password, setPassword] = React.useState('');

  const [infoMessage, setInfoMessage] = React.useState('');

  const syncingState = useSyncStore((state) => state.syncingState);

  const action = useSyncStore((state) => state.action);

  const message = useSyncStore((state) => state.message);

  const [isEncryptionEnabled, setIsEncryptionEnabled] = React.useState(false);

  const configureEncryption = useSyncStore((state) => state.setSyncEncryption);

  const handleDisableEncryption = async () => {
    const newSetting = { ...syncSetting, encryptionEnabled: false };

    delete newSetting.encryptionKey;
    delete newSetting.encryptionSalt;

    await SyncSetting.update(newSetting);

    setIsEncryptionEnabled(false);
  };

  const handleOnClick = async () => {
    setInfoMessage('');

    if (!password) {
      setInfoMessage('Enter a password to continue.');
      return;
    }

    await configureEncryption(password);
  };

  const renderText = () => {
    if (
      action !== BrowserMessageAction.SetSyncEncryption ||
      syncingState === SyncState.Idle
    ) {
      return (
        <>
          <KeyRound />
          <span>Set Encryption Password</span>
        </>
      );
    }

    switch (syncingState) {
      case SyncState.Running:
        return (
          <>
            <RefreshCwIcon className="animate-spin" />
            <span>Setting Encryption Password...</span>
          </>
        );
      case SyncState.Error:
        return (
          <>
            <CloudAlertIcon />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <KeyRound />
            <span>Set Encryption Password</span>
          </>
        );
    }
  };

  const messageContent = () => {
    if (message && action === BrowserMessageAction.SetSyncEncryption)
      return (
        <p
          className={`text-sm mt-2 ${
            syncingState === SyncState.Error
              ? 'text-destructive'
              : 'text-muted-foreground'
          }`}
        >
          {message}
        </p>
      );

    if (infoMessage) {
      return <p className="text-destructive text-sm mt-2">{infoMessage}</p>;
    }
  };

  useEffect(() => {
    if (
      syncingState === SyncState.Completed &&
      action === BrowserMessageAction.SetSyncEncryption
    ) {
      setIsEncryptionEnabled(true);
    }
  }, [syncingState, action]);

  useEffect(() => {
    if (typeof syncSetting.encryptionEnabled == 'boolean') {
      setIsEncryptionEnabled(syncSetting.encryptionEnabled);
    }
  }, [syncSetting.encryptionEnabled]);

  return (
    <>
      <SettingItem
        title="Encrypted Sync"
        description="Encrypts collection and item content before it is sent to your sync provider."
      >
        {isEncryptionEnabled ? (
          <Switch checked={true} onCheckedChange={handleDisableEncryption} />
        ) : (
          <span className="text-muted-foreground">Disabled</span>
        )}
      </SettingItem>

      {!isEncryptionEnabled && (
        <div className="grid gap-3 py-5">
          <p className="text-sm text-muted-foreground">
            Set a password to encrypt the existing sync file during the next
            sync.
          </p>
          <Input
            type="password"
            placeholder="Encryption Password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={syncingState === SyncState.Running}
              onClick={handleOnClick}
            >
              {renderText()}
            </Button>
            {messageContent()}
          </div>
        </div>
      )}

      <div className="grid gap-3 py-5">
        <p className="text-sm text-muted-foreground">
          Losing this password will result in the inability to decrypt your sync
          data.
        </p>
        <p className="text-sm text-muted-foreground">
          If you forget the password, you can delete your remote sync files and
          set a new password again. And remember to update the password on all
          your devices.
        </p>
      </div>
    </>
  );
}

export default SyncEncryptionSetting;
