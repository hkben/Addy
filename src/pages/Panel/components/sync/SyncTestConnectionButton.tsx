import React, { Fragment } from 'react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import log from 'loglevel';
import { useSyncStore, SyncState } from '@/common/store/useSyncStore';
import { BrowserMessageAction } from '@/common/interface';

function SyncConnectionTestButton() {
  const syncingState = useSyncStore((state) => state.syncingState);

  const startSyncAction = useSyncStore((state) => state.startSyncAction);

  const action = useSyncStore((state) => state.action);

  const handleOnClick = () => {
    startSyncAction(BrowserMessageAction.SyncConnectionTest);
  };

  const defaultContent = () => {
    return <span>Connection Test</span>;
  };

  const renderText = () => {
    if (action !== BrowserMessageAction.SyncConnectionTest) {
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
            <span>Testing...</span>
          </Fragment>
        );
      case SyncState.Completed:
        return (
          <Fragment>
            <CheckCircleIcon className="h-6 w-6 mr-1" strokeWidth={2} />
            <span>Connected!</span>
          </Fragment>
        );
      case SyncState.Error:
        return (
          <Fragment>
            <XCircleIcon className="h-6 w-6 mr-1" strokeWidth={2} />

            <span>Unauthorized</span>
          </Fragment>
        );
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

export default SyncConnectionTestButton;
