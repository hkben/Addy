import _ from 'lodash';
import React from 'react';
import { useEffect } from 'react';
import Setting from '../storage/setting';
import log from 'loglevel';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = React.useState(true); //Default true to avoid flash

  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    getDarkMode().catch(log.error);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (loaded) {
      updateDarkMode();
    }
  }, [darkMode]);

  const getDarkMode = async () => {
    let _darkMode = await Setting.fetchDarkMode();
    setDarkMode(_darkMode);
    setLoaded(true);
  };

  const updateDarkMode = async () => {
    await Setting.updateDarkMode(darkMode);
  };

  return [darkMode, setDarkMode] as const;
};
