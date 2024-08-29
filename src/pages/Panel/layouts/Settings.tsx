import React from 'react';
import { Link, Outlet } from 'react-router-dom';

class Settings extends React.Component<{}> {
  render() {
    return (
      <div className="xl:container w-full flex flex-wrap mx-auto p-2">
        <div className="w-1/5 lg:px-6 text-xl text-gray-800 leading-normal dark:text-gray-50">
          <p className="font-bold underline underline-offset-auto">Settings</p>

          <ul className="py-5">
            <li className="py-1">
              <Link to="general">General</Link>
            </li>
            <li className="py-1">
              <Link to="sync">Sync</Link>
            </li>
            <li className="py-1">
              <Link to="export">Export</Link>
            </li>
            <li className="py-1">
              <Link to="import">Import</Link>
            </li>
            <li className="py-1">
              <Link to="welcome">Welcome Page</Link>
            </li>
            <li className="py-1">
              <Link to="information">Information</Link>
            </li>
          </ul>
        </div>

        <div className="w-4/5 p-8 text-gray-900 leading-normal bg-white border border-gray-400 dark:text-gray-50 dark:bg-gray-800 dark:border-gray-400">
          <Outlet />
        </div>
      </div>
    );
  }
}

export default Settings;
