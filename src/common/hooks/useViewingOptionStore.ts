import { create } from 'zustand';
import { Setting } from '../storage';
import { IViewingOption } from '../interface';

interface Store {
  viewingOption: IViewingOption | null;
  fetchViewingOption: () => void;
}

const useViewingOptionStore = create<Store>((set) => ({
  viewingOption: null,
  fetchViewingOption: async () => {
    let _viewingOption = await Setting.fetchViewingOption();
    set({ viewingOption: _viewingOption });
  },
}));

export default useViewingOptionStore;
