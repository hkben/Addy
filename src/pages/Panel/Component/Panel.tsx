import React, { useEffect } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
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
import { MoonIcon } from '@heroicons/react/24/solid';

function Panel() {
  const [darkMode, setDarkMode] = useDarkMode();

  const toggleDarkMode = async (event: React.MouseEvent<HTMLDivElement>) => {
    let _darkMode = darkMode ? false : true;

    setDarkMode(_darkMode);
  };

  return (
    <HashRouter>
      <div>
        <nav className="flex items-center justify-between max-w-3xl p-4 mx-auto">
          <a
            className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-700"
            href="#"
          >
            <img src="icon-34.png" />
          </a>

          <ul className="flex items-center space-x-2 text-sm font-semibold text-gray-500 dark:text-gray-50">
            <li>
              <Link to="/" className="px-3 py-2 rounded-lg cursor-pointer">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/setting/sync"
                className="px-3 py-2 rounded-lg cursor-pointer"
              >
                Sync
              </Link>
            </li>

            <li>
              <Link
                to="/setting"
                className="px-3 py-2 rounded-lg cursor-pointer"
              >
                Settings
              </Link>
            </li>

            <li>
              <div className="cursor-pointer mx-auto" onClick={toggleDarkMode}>
                <MoonIcon className="h-4 w-4" strokeWidth={2} />
              </div>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="setting" element={<Settings />}>
            <Route index element={<General />} />
            <Route path="general" element={<General />} />
            <Route path="export" element={<Export />} />
            <Route path="import" element={<Import />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="information" element={<Information />} />
            <Route path="sync" element={<SyncSettings />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default Panel;
