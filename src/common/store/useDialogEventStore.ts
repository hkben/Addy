import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import log from 'loglevel';

enum DialogEventType {
  DeleteItem,
  DeleteItems,
  EditItem,
  DeleteCollection,
  EmptyCollection,
  ImagesDownload,
  ColumnReorder,
}

interface DialogEvent {
  type: DialogEventType;
  collectionId?: string;
  itemId?: string;
  itemIds?: string[];
}

interface Store {
  event?: DialogEvent;
  setDialogEvent: (event: DialogEvent) => void;
  resetDialogEvent: () => void;
}

const useDialogEventStore = create<Store>()(
  immer((set, get) => ({
    // Initial state
    event: undefined,
    setDialogEvent: (event: DialogEvent) => {
      log.debug('[useDialogEventStore] setDialogEvent', event);
      set({ event });
    },
    resetDialogEvent: () => {
      log.debug('[useDialogEventStore] resetDialogEvent');
      set({ event: undefined });
    },
  }))
);

export { DialogEventType, useDialogEventStore };
