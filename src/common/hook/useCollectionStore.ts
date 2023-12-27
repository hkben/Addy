import { create } from 'zustand';
import { ICollection } from '../interface';
import { immer } from 'zustand/middleware/immer';

interface Store {
  collection: ICollection;
  setCollection: (collection: ICollection) => void;
}

const useCollectionStore = create<Store>()(
  immer((set) => ({
    collection: {} as ICollection,
    setCollection: (_collection) => {
      set({ collection: _collection });
    },
  }))
);

export default useCollectionStore;
