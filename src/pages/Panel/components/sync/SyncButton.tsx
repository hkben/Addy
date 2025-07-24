import React, { Fragment } from 'react';
import { BrowserMessageAction } from '@/common/interface';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';
import log from 'loglevel';

function SyncButton() {
  const syncingState = useSyncStore((state) => state.syncingState);

  const startSyncAction = useSyncStore((state) => state.startSyncAction);

  const action = useSyncStore((state) => state.action);

  const handleOnClick = async () => {
    startSyncAction(BrowserMessageAction.SyncBackgroundRun);
  };

  const defaultContent = () => {
    return <span>Sync Now</span>;
  };

  const renderText = () => {
    if (action !== BrowserMessageAction.SyncBackgroundRun) {
      return defaultContent();
    }

    switch (syncingState) {
      case SyncState.Idle:
        return defaultContent();
      case SyncState.Running:
        return (
          <Fragment>
            <ArrowPathIcon
              className="animate-spin h-5 w-5 inline mr-1"
              strokeWidth={3}
            />
            <span>Syncing...</span>
          </Fragment>
        );
      case SyncState.Completed:
        return <span>Sync Completed!</span>;
      case SyncState.Error:
        return <span>Sync Error</span>;
      default:
        return '';
    }
  };

  return (
    <button
      className="flex mx-auto p-2 px-5 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
      onClick={handleOnClick}
    >
      {renderText()}
    </button>
  );
}

export default SyncButton;
