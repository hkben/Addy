import React, { Fragment, useEffect } from 'react';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../../../common/interface';

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
    console.log('onMessageListener');

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
            <span>Testing...</span>
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Connected!</span>
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

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
