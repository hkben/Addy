import _ from 'lodash';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './Viewer/SideBar';

function Home() {
  return (
    <div className="xl:container w-full flex flex-wrap mx-auto px-2 m-16">
      <div className="w-1/5 lg:px-6 text-xl text-gray-800 leading-normal dark:text-gray-50">
        <SideBar />
      </div>

      <div className="w-4/5 p-8 text-gray-900 bg-white border border-gray-400 dark:text-gray-50 dark:bg-gray-800 dark:border-gray-400">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
