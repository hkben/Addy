import React, { useEffect } from 'react';
import {
  HashRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { ISetting } from '@/common/interface';
import Export from './pages/settings/Export';
import General from './pages/settings/General';
import Home from './layouts/Home';
import Import from './pages/settings/Import';
import Settings from './layouts/Settings';
import { Setting, Storage } from '@/common/storage';
import { useDarkMode } from '@/common/hooks/useDarkMode';
import Info from './pages/settings/Information';
import Information from './pages/settings/Information';
import Welcome from './pages/Welcome';
import SyncSettings from './components/sync/SyncSettings';
import CollectionViewer, { loader } from './pages/CollectionViewer';
import { MoonIcon } from '@heroicons/react/24/solid';
import Layout from './layouts/Layout';
import log from 'loglevel';
import Common from '@/common/common';
import useSettingStore from '@/common/store/useSettingStore';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />}>
        <Route index element={<Welcome />} />
        <Route
          path="/:collectionId"
          loader={loader}
          element={<CollectionViewer />}
        />
      </Route>
      <Route path="setting" element={<Settings />}>
        <Route index element={<General />} />
        <Route path="general" element={<General />} />
        <Route path="export" element={<Export />} />
        <Route path="import" element={<Import />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="information" element={<Information />} />
        <Route path="sync" element={<SyncSettings />} />
      </Route>
    </Route>
  )
);

function Panel() {
  const { setting } = useSettingStore();

  useEffect(() => {
    let debugMode = setting?.debugMode ?? false;
    Common.setLogLevel(debugMode);
  }, [setting?.debugMode]);

  return <RouterProvider router={router} />;
}

export default Panel;
