import { create } from 'zustand';
import { BrowserMessageAction, IBrowserMessage } from '../interface';
import { immer } from 'zustand/middleware/immer';
import log from 'loglevel';
import _ from 'lodash';
import Browser from 'webextension-polyfill';
import SyncSetting from '../storage/syncSetting';

enum SyncState {
  Idle,
  Running,
  Completed,
  Error,
}

export interface Store {
  sync: boolean;
  syncingState: SyncState;
  action?: BrowserMessageAction;
  lastSyncTime?: Date;
  fetch: () => Promise<boolean>;
  setSyncingState: (state: number) => void;
  startSyncAction: (action: BrowserMessageAction) => void;
}

//Centralized State and Logic

const useSyncStore = create<Store>()(
  immer((set, get) => {
    // Listener for messages from the background script
    const onMessageListener = (packet: IBrowserMessage, sender: any) => {
      log.debug('[useSyncStore] onMessageListener');
      log.debug(packet);

      switch (packet.action) {
        case BrowserMessageAction.SyncCompleted:
          onSyncCompleted(packet);
          break;
        case BrowserMessageAction.SyncConnectionTestCompleted:
          onSyncConnectionTestCompleted(packet);
          break;
      }
    };

    // Function to handle sync completion
    const onSyncCompleted = (packet: IBrowserMessage) => {
      if (packet.result) {
        set({ syncingState: SyncState.Completed });
        set({ lastSyncTime: new Date() });
        log.debug('Sync completed successfully');
      } else {
        set({ syncingState: SyncState.Error });
        log.error('Sync failed');
      }

      setTimeout(resetSyncingState, 5000);
    };

    // Function to handle connection test completion
    const onSyncConnectionTestCompleted = (packet: IBrowserMessage) => {
      set({
        syncingState: packet.result ? SyncState.Completed : SyncState.Error,
      });

      setTimeout(resetSyncingState, 5000);
    };

    // Function to reset syncing state
    const resetSyncingState = () => {
      set({ action: undefined });
      set({ syncingState: SyncState.Idle });
    };

    Browser.runtime.onMessage.addListener(onMessageListener);

    return {
      sync: false,
      syncingState: SyncState.Idle,
      action: undefined,
      lastSyncTime: undefined,
      fetch: async () => {
        log.debug('[useSettingStore] Fetching setting from storage...');

        const setting = await SyncSetting.fetch();

        log.debug('[useSettingStore] Fetched setting:', setting);

        set({
          sync: setting.enable,
          lastSyncTime: setting.lastSyncTime
            ? new Date(setting.lastSyncTime)
            : undefined,
        });

        return true;
      },
      setSyncingState: (state: SyncState) => {
        log.debug('[useSyncStore] Setting syncing state:', state);
        set({ syncingState: state });
      },
      startSyncAction: async (action: BrowserMessageAction) => {
        if (get().syncingState !== SyncState.Idle) {
          log.warn('[useSyncStore] Sync already in progress');
          return;
        }

        Browser.runtime.sendMessage({ action } as IBrowserMessage);

        set({ action });
        set({ syncingState: SyncState.Running }); // Set to Running state
      },
    };
  })
);

export { useSyncStore, SyncState };
