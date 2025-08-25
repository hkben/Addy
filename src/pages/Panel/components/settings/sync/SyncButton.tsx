import React, { Fragment } from 'react';
import { BrowserMessageAction } from '@/common/interface';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';
import log from 'loglevel';
import { Button } from '@/components/ui/button';
import { CloudAlertIcon, CloudCheckIcon, RefreshCwIcon } from 'lucide-react';

function SyncButton() {
  const syncingState = useSyncStore((state) => state.syncingState);

  const startSyncAction = useSyncStore((state) => state.startSyncAction);

  const action = useSyncStore((state) => state.action);

  const message = useSyncStore((state) => state.message);

  const handleOnClick = async () => {
    startSyncAction(BrowserMessageAction.SyncBackgroundRun);
  };

  const renderText = () => {
    if (
      action !== BrowserMessageAction.SyncBackgroundRun ||
      syncingState === SyncState.Idle
    ) {
      return (
        <>
          <RefreshCwIcon />
          <span>Sync Now</span>
        </>
      );
    }

    switch (syncingState) {
      case SyncState.Running:
        return (
          <>
            <RefreshCwIcon className="animate-spin" />
            <span>Syncing...</span>
          </>
        );
      case SyncState.Completed:
        return (
          <>
            <CloudCheckIcon />
            <span>Sync Completed!</span>
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
        return null;
    }
  };

  const messageContent = () => {
    if (
      syncingState === SyncState.Error &&
      action === BrowserMessageAction.SyncBackgroundRun
    )
      return (
        <p className="text-destructive text-sm mt-2">
          {message || 'An error occurred during sync.'}
        </p>
      );
  };

  return (
    <>
      <Button
        variant="outline"
        disabled={syncingState === SyncState.Running}
        onClick={handleOnClick}
      >
        {renderText()}
      </Button>
      {messageContent()}
    </>
  );
}

export default SyncButton;
