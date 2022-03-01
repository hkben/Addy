import React from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import Export from './Export';
import General from './General';
import Home from './Home';
import Import from './Import';
import Settings from './Settings';

class Panel extends React.Component<{}> {
  // constructor(props: {}) {
  //   super(props);

  //   // this.newCollection = this.newCollection.bind(this);
  // }

  render() {
    return (
      <HashRouter>
        <div>
          <nav className="flex items-center justify-between max-w-3xl p-4 mx-auto">
            <a
              className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg"
              href="/"
            >
              <img src="icon-34.png" />
            </a>

            <ul className="flex items-center space-x-2 text-sm font-medium text-gray-500">
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
}

export default Panel;
