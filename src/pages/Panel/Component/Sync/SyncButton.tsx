import React, { Fragment, useEffect } from 'react';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../../../common/interface';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import log from 'loglevel';

interface Prop {
  callbackAfterSync: () => Promise<void>;
}

function SyncButton({ callbackAfterSync }: Prop) {
  const [syncingState, setSyncingState] = React.useState<number>(0);

  const resetSyncingState = () => {
    setSyncingState(0);
  };

  const handleBackgroundSync = async () => {
    if (syncingState != 0) {
      return;
    }

    Browser.runtime.sendMessage({
      action: 'SyncBackgroundRun',
    } as IBrowserMessage);

    setSyncingState(1); //Syncing
  };

  const onMessageListener = (packet: IBrowserMessage, sender: any) => {
    log.trace('onMessageListener');

    if (packet.action == 'SyncCompleted') {
      if (packet.result) {
        setSyncingState(2); //Completed
        callbackAfterSync().catch(log.error);
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
        return <span>Sync Now</span>;
      case 1:
        return (
          <Fragment>
            <ArrowPathIcon
              className="animate-spin h-5 w-5 inline mr-1"
              strokeWidth={3}
            />
            <span>Syncing...</span>
          </Fragment>
        );
      case 2:
        return <span>Sync Completed!</span>;
      case 3:
        return <span>Sync Error</span>;
      default:
        return '';
    }
  };

  return (
    <button
      className="flex mx-auto p-2 px-5 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
      onClick={handleBackgroundSync}
    >
      {renderText()}
    </button>
  );
}

export default SyncButton;
