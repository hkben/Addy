import React, { Fragment, useEffect } from 'react';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../../../common/interface';

interface Prop {
  callbackAfterSync: () => Promise<void>;
}

function SyncDeleteButton({ callbackAfterSync }: Prop) {
  const [syncingState, setSyncingState] = React.useState<number>(0);

  const resetSyncingState = () => {
    setSyncingState(0);
  };

  const handleBackgroundSyncDelete = async () => {
    if (syncingState != 0) {
      return;
    }

    Browser.runtime.sendMessage({
      action: 'SyncFileDeletion',
    } as IBrowserMessage);

    setSyncingState(1); //Syncing
  };

  const onMessageListener = (packet: IBrowserMessage, sender: any) => {
    console.log('onMessageListener');

    if (packet.action == 'SyncFileDeletionCompleted') {
      if (packet.result) {
        setSyncingState(2); //Completed
        callbackAfterSync().catch(console.error);
      } else {
        setSyncingState(3); //Error
      }
      setTimeout(resetSyncingState, 5000);
    }
  };

  useEffect(() => {
    Browser.runtime.onMessage.addListener(onMessageListener);
    return () => {
      Browser.runtime.onMessage.addListener(onMessageListener);
    };
  }, []);

  const renderText = () => {
    switch (syncingState) {
      case 0:
        return <span>Delete Remote Data</span>;
      case 1:
        return (
          <Fragment>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-5 w-5 inline mr-1"
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
            <span>Deleting...</span>
          </Fragment>
        );
      case 2:
        return <span>Deletion Completed!</span>;
      case 3:
        return <span>Deletion Error</span>;
      default:
        return '';
    }
  };

  return (
    <button
      className="flex mx-auto p-2 px-5 text-base text-white bg-red-500 hover:bg-red-700 rounded-md items-center"
      onClick={() => {
        const confirmBox = window.confirm(
          'Do you really want to delete remote data?'
        );
        if (confirmBox === true) {
          handleBackgroundSyncDelete();
        }
      }}
    >
      {renderText()}
    </button>
  );
}

export default SyncDeleteButton;
