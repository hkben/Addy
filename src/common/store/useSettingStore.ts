import { create } from 'zustand';
import { Setting } from '../storage';
import { ISetting } from '../interface';
import { immer } from 'zustand/middleware/immer';
import log from 'loglevel';

interface Store {
  setting?: ISetting;
  fetch: () => Promise<boolean>;
  updateSetting: (newSetting: Partial<ISetting>) => Promise<void>;
}

const useSettingStore = create<Store>()(
  immer((set, get) => ({
    // Initial state
    setting: undefined,
    fetch: async () => {
      log.debug('[useSettingStore] Fetching setting from storage...');

      const setting = await Setting.fetch();
      set({ setting });
      return true;
    },
    updateSetting: async (newSetting: Partial<ISetting>) => {
      log.debug(
        '[useSettingStore] Updating setting with new values:',
        newSetting
      );

      const _setting = get().setting;

      if (_setting == null) {
        log.error('[useSettingStore] Setting is not initialized.');
        return;
      }

      Object.assign(_setting, newSetting);
      set({ setting: _setting });

      // Update the setting in storage
      await Setting.update(_setting);
    },
  }))
);

export default useSettingStore;
