import React, { Fragment } from 'react';
import { BrowserMessageAction } from '@/common/interface';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import log from 'loglevel';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';

function SyncDeleteButton() {
  const syncingState = useSyncStore((state) => state.syncingState);

  const startSyncAction = useSyncStore((state) => state.startSyncAction);

  const action = useSyncStore((state) => state.action);

  const handleOnClick = async () => {
    const confirmBox = window.confirm(
      'Do you really want to delete remote data?'
    );

    if (confirmBox === true) {
      startSyncAction(BrowserMessageAction.SyncBackgroundRun);
    }
  };

  const defaultContent = () => {
    return <span>Delete Remote Data</span>;
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
            <span>Deleting...</span>
          </Fragment>
        );
      case SyncState.Completed:
        return <span>Deletion Completed!</span>;
      case SyncState.Error:
        return <span>Deletion Error</span>;
      default:
        return '';
    }
  };

  return (
    <button
      className="flex mx-auto p-2 px-5 text-base text-white bg-red-500 hover:bg-red-700 rounded-md items-center"
      onClick={handleOnClick}
    >
      {renderText()}
    </button>
  );
}

export default SyncDeleteButton;
