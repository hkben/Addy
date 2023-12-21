import { create } from 'zustand';
import { Collections } from '../storage';
import { ICollectionSummary } from '../interface';

interface Store {
  summary: ICollectionSummary[];
  fetchList: () => void;
}

const useCollectionsListStore = create<Store>((set) => ({
  summary: [],
  fetchList: async () => {
    let _summary = await Collections.fetchSummary();
    set({ summary: _summary });
  },
}));

export default useCollectionsListStore;
