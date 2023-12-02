import { create } from 'zustand';
import { Setting } from '../storage';
import { IViewingOption } from '../interface';

interface Store {
  viewingOption: IViewingOption;
  fetchViewingOption: () => void;
}

const useViewingOptionStore = create<Store>((set) => ({
  viewingOption: {
    hiddenColumns: [],
    spacing: '',
    imageColumns: 0,
    sortBy: [],
    timeDisplay: 0,
  },
  fetchViewingOption: async () => {
    let _viewingOption = await Setting.fetchViewingOption();
    set({ viewingOption: _viewingOption });
  },
}));

export default useViewingOptionStore;
