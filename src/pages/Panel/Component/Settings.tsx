import React from 'react';
import { Link, Outlet } from 'react-router-dom';

class Settings extends React.Component<{}> {
  render() {
    return (
      <div className="container w-full flex flex-wrap mx-auto p-2 m-16">
        <div className="w-full lg:w-1/5 lg:px-6 text-xl text-gray-800 leading-normal">
          <p className="font-black underline underline-offset-8">Settings</p>

          <ul className="py-5">
            <li className="py-1">
              <Link to="export">Export</Link>
            </li>
            <li className="py-1">
              <Link to="import">Import</Link>
            </li>
          </ul>
        </div>

        <div className="w-full h-full lg:w-4/5 p-8 mt-6 lg:mt-0 text-gray-900 leading-normal bg-white border border-gray-400 border-rounded">
          <Outlet />
        </div>
      </div>
    );
  }
}

export default Settings;
