import React from 'react';
import { createRoot } from 'react-dom/client';

import '@/style.scss';
import './index.scss';
import Panel from './Panel';
import useSettingStore from '@/common/store/useSettingStore';
import log from 'loglevel';

async function initializeApp() {
  log.debug('[Addy] Initializing...');
  await useSettingStore.getState().fetch();
  log.debug('[Addy] Settings fetched:', useSettingStore.getState().setting);
}

initializeApp().then(() => {
  const container = window.document.querySelector('#app-container');
  const root = createRoot(container!);
  root.render(<Panel />);
});
