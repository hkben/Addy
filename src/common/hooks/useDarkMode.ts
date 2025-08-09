import React from 'react';
import { useEffect } from 'react';
import useSettingStore from '../store/useSettingStore';

export const useDarkMode = () => {
  const { setting, updateSetting } = useSettingStore();

  const [darkMode, setDarkMode] = React.useState(() => {
    return setting?.darkMode ?? true; // Default to true to avoid flash
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const updateDarkMode = async (_darkMode: boolean) => {
    if (darkMode === _darkMode) {
      return; // No change
    }

    setDarkMode(_darkMode);
    await updateSetting({ darkMode: _darkMode });
  };

  return [darkMode, updateDarkMode] as const;
};
