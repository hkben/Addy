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
  message?: string;
  lastSyncTime?: Date;
  needRefresh: boolean;
  fetch: () => Promise<boolean>;
  setSyncingState: (state: number) => void;
  startSyncAction: (action: BrowserMessageAction) => void;
  resetRefreshFlag: () => void;
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
        case BrowserMessageAction.SyncFileDeletionCompleted:
          onSyncFileDeletionCompleted(packet);
          break;
        case BrowserMessageAction.OnCollectionUpdated:
          // not related to sync function directly, but we update needRefresh flag to trigger UI refresh
          set({ needRefresh: true });
          break;
      }
    };

    // Function to handle sync completion
    const onSyncCompleted = (packet: IBrowserMessage) => {
      if (packet.result) {
        set({ syncingState: SyncState.Completed });
        set({ lastSyncTime: new Date() });
        set({ needRefresh: true });
        log.debug('Sync completed successfully');
      } else {
        set({ syncingState: SyncState.Error });
        set({ message: packet.message || 'Sync failed' });
        log.error('Sync failed');
      }

      setTimeout(resetSyncingState, 5000);
    };

    // Function to handle connection test completion
    const onSyncConnectionTestCompleted = (packet: IBrowserMessage) => {
      set({
        syncingState: packet.result ? SyncState.Completed : SyncState.Error,
      });

      if (!packet.result) {
        set({ message: packet.message || 'Connection test failed' });
        log.error('Connection test failed');
      }

      setTimeout(resetSyncingState, 5000);
    };

    // Function to handle file deletion completion
    const onSyncFileDeletionCompleted = (packet: IBrowserMessage) => {
      if (packet.result) {
        set({ syncingState: SyncState.Completed });
        log.debug('Sync file deletion completed successfully');
      } else {
        set({ syncingState: SyncState.Error });
        set({ message: packet.message || 'Sync file deletion failed' });
        log.error('Sync file deletion failed');
      }

      setTimeout(resetSyncingState, 5000);
    };

    // Function to reset syncing state
    const resetSyncingState = () => {
      set({ action: undefined });
      set({ syncingState: SyncState.Idle });
      set({ message: undefined });
    };

    Browser.runtime.onMessage.addListener(onMessageListener);

    return {
      sync: false,
      syncingState: SyncState.Idle,
      action: undefined,
      message: undefined,
      lastSyncTime: undefined,
      needRefresh: false,
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
      resetRefreshFlag: () => {
        set({ needRefresh: false });
      },
    };
  })
);

export { useSyncStore, SyncState };
