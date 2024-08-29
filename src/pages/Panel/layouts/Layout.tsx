import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  HashRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { MoonIcon } from '@heroicons/react/24/solid';
import { useDarkMode } from '../../../common/hook/useDarkMode';

function Layout() {
  const [darkMode, setDarkMode] = useDarkMode();

  const toggleDarkMode = async (event: React.MouseEvent<HTMLDivElement>) => {
    let _darkMode = darkMode ? false : true;

    setDarkMode(_darkMode);
  };

  return (
    <div>
      <nav className="flex items-center justify-between max-w-3xl p-4 mx-auto h-16">
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
            <Link to="/setting" className="px-3 py-2 rounded-lg cursor-pointer">
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
      <Outlet />
    </div>
  );
}

export default Layout;
