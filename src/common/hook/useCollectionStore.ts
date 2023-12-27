import { create } from 'zustand';
import { ICollection } from '../interface';
import { CollectionItem } from '../storage';
import useCollectionsListStore from './useCollectionsListStore';
import { immer } from 'zustand/middleware/immer';

interface Store {
  collection: ICollection;
  setCollection: (collection: ICollection) => void;
  removeCollectionItem: (_collectionId: string, _item: string) => void;
}

const useCollectionStore = create<Store>()(
  immer((set) => ({
    collection: {} as ICollection,
    setCollection: (_collection) => {
      set({ collection: _collection });
    },
    removeCollectionItem: async (_collectionId, _item) => {
      let result = await CollectionItem.delete(_collectionId, _item);

      if (result == false) {
        return;
      }

      let fetchCollectionsList = useCollectionsListStore.getState().fetchList;

      set((state) => {
        let index = state.collection.items.findIndex(
          (item) => item.id === _item
        );

        if (index >= 0) {
          state.collection.items.splice(index, 1);
        }
      });

      //refresh collection list
      fetchCollectionsList();
    },
  }))
);

export default useCollectionStore;
