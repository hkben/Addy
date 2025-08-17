import React, { Fragment } from 'react';
import { BrowserMessageAction } from '@/common/interface';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import log from 'loglevel';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';
import { Button } from '@/components/ui/button';

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
    <Button variant="destructive" onClick={handleOnClick}>
      {renderText()}
    </Button>
  );
}

export default SyncDeleteButton;
