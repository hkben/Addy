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
import { ISetting } from '../../../common/interface';
import Export from './Export';
import General from './General';
import Home from './Home';
import Import from './Import';
import Settings from './Settings';
import { Setting, Storage } from '../../../common/storage';
import { useDarkMode } from '../../../common/hook/useDarkMode';
import Info from './Information';
import Information from './Information';
import Welcome from './Welcome';
import SyncSettings from './Sync/SyncSettings';
import CollectionViewer, { loader } from './CollectionViewer';
import { MoonIcon } from '@heroicons/react/24/solid';
import Layout from './Layout';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />}>
        <Route index element={<Welcome />} />
        <Route
          path="/:collectionId"
          loader={loader}
          element={
            <CollectionViewer
              callback={function (): Promise<void> {
                throw new Error('Function not implemented.');
              }}
            />
          }
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
  return <RouterProvider router={router} />;
}

export default Panel;
