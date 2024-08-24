import React, { Fragment, useEffect } from 'react';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../../../common/interface';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import log from 'loglevel';

function SyncConnectionTestButton() {
  const [connectionState, setConnectionState] = React.useState<number>(0);

  const resetSyncingState = () => {
    setConnectionState(0);
  };

  const handleTestConnection = async () => {
    if (connectionState != 0) {
      return;
    }

    Browser.runtime.sendMessage({
      action: 'SyncConnectionTest',
    } as IBrowserMessage);

    setConnectionState(1); //Testing
  };

  const onMessageListener = (packet: IBrowserMessage, sender: any) => {
    log.trace('onMessageListener');

    if (packet.action == 'SyncConnectionTestCompleted') {
      if (packet.result) {
        setConnectionState(2); //Completed
      } else {
        setConnectionState(3); //Error
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
    switch (connectionState) {
      case 0:
        return <span>Connection Test</span>;
      case 1:
        return (
          <Fragment>
            <ArrowPathIcon
              className="animate-spin h-5 w-5 inline mr-1"
              strokeWidth={3}
            />
            <span>Testing...</span>
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <CheckCircleIcon className="h-6 w-6 mr-1" strokeWidth={2} />
            <span>Connected!</span>
          </Fragment>
        );
      case 3:
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
      onClick={handleTestConnection}
    >
      {renderText()}
    </button>
  );
}

export default SyncConnectionTestButton;
