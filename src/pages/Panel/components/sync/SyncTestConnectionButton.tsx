import React, { Fragment } from 'react';
import log from 'loglevel';
import { useSyncStore, SyncState } from '@/common/store/useSyncStore';
import { BrowserMessageAction } from '@/common/interface';
import { Button } from '@/components/ui/button';
import {
  CloudAlertIcon,
  CloudCheckIcon,
  NetworkIcon,
  RefreshCwIcon,
} from 'lucide-react';

function SyncConnectionTestButton() {
  const syncingState = useSyncStore((state) => state.syncingState);

  const startSyncAction = useSyncStore((state) => state.startSyncAction);

  const action = useSyncStore((state) => state.action);

  const handleOnClick = () => {
    startSyncAction(BrowserMessageAction.SyncConnectionTest);
  };

  const renderText = () => {
    if (
      action !== BrowserMessageAction.SyncConnectionTest ||
      syncingState === SyncState.Idle
    ) {
      return (
        <>
          <NetworkIcon />
          <span>Connection Test</span>
        </>
      );
    }

    switch (syncingState) {
      case SyncState.Running:
        return (
          <>
            <RefreshCwIcon />
            <span>Testing...</span>
          </>
        );
      case SyncState.Completed:
        return (
          <>
            <CloudCheckIcon />
            <span>Success</span>
          </>
        );
      case SyncState.Error:
        return (
          <>
            <CloudAlertIcon />
            <span>Unauthorized</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Button
      variant="outline"
      disabled={syncingState === SyncState.Running}
      onClick={handleOnClick}
    >
      {renderText()}
    </Button>
  );
}

export default SyncConnectionTestButton;
