import React, { useEffect } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { ISetting } from '../../interface';
import Export from './Export';
import General from './General';
import Home from './Home';
import Import from './Import';
import Settings from './Settings';
import Storage from '../../storage';

function Panel() {
  const [darkMode, setDarkMode] = React.useState(false);

  useEffect(() => {
    const getSetting = async () => {
      let setting = await Storage.getSetting();

      if (setting.darkMode) {
        setDarkMode(true);
      }
    };

    getSetting().catch(console.error);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = async (event: React.MouseEvent<HTMLDivElement>) => {
    let _darkMode = darkMode ? false : true;

    setDarkMode(_darkMode);

    let setting = await Storage.getSetting();
    setting.darkMode = _darkMode;

    await Storage.updateSetting(setting);
  };

  return (
    <HashRouter>
      <div>
        <nav className="flex items-center justify-between max-w-3xl p-4 mx-auto">
          <a
            className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-700"
            href="/"
          >
            <img src="icon-34.png" />
          </a>

          <ul className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-50">
            <li>
              <Link to="/" className="px-3 py-2 rounded-lg cursor-pointer">
                Home
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </div>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="setting" element={<Settings />}>
            <Route index element={<Export />} />
            <Route path="general" element={<General />} />
            <Route path="export" element={<Export />} />
            <Route path="import" element={<Import />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default Panel;
