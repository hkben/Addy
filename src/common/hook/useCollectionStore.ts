import { create } from 'zustand';
import { ICollection } from '../interface';
import { Collection, CollectionItem } from '../storage';
import useCollectionsListStore from './useCollectionsListStore';
import { immer } from 'zustand/middleware/immer';

interface Store {
  collection: ICollection;
  setCollection: (collection: ICollection) => void;
  removeCollectionItem: (_collectionId: string, _item: string) => void;
  editCollectionItem: (
    _collectionId: string,
    _item: string,
    _content: string
  ) => void;
  removeAllItems: (_collectionId: string) => void;
  changeCollectionColor: (_collectionId: string, _color: number) => void;
  moveCollectionItem: (
    _collectionId: string,
    _itemId: string,
    _newCollectionId: string
  ) => void;
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
    editCollectionItem: async (_collectionId, _itemId, _content) => {
      let { result, datetime } = await CollectionItem.updateContent(
        _collectionId,
        _itemId,
        _content
      );

      if (result) {
        set((state) => {
          let index = state.collection.items.findIndex(
            (item) => item.id === _itemId
          );

          if (index >= 0) {
            state.collection.items[index].content = _content;
            state.collection.items[index].modifyTime = datetime;
          }
        });
      }
    },
    removeAllItems: async (_collectionId) => {
      let result = await Collection.deleteAllItems(_collectionId);

      if (result == false) {
        return;
      }
      let fetchCollectionsList = useCollectionsListStore.getState().fetchList;

      set((state) => {
        state.collection.items = [];
      });

      //refresh collection list
      fetchCollectionsList();
    },
    changeCollectionColor: async (_collectionId, _color) => {
      let result = await Collection.updateColor(_collectionId, _color);

      if (result == false) {
        return;
      }

      let fetchCollectionsList = useCollectionsListStore.getState().fetchList;

      set((state) => {
        state.collection.color = _color;
      });

      //refresh collection list
      fetchCollectionsList();
    },
    moveCollectionItem: async (_collectionId, _itemId, _newCollectionId) => {
      let result = await CollectionItem.move(
        _collectionId,
        _itemId,
        _newCollectionId
      );

      if (result == false) {
        return;
      }

      let fetchCollectionsList = useCollectionsListStore.getState().fetchList;

      set((state) => {
        let index = state.collection.items.findIndex(
          (item) => item.id === _itemId
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
