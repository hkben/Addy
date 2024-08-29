import _ from 'lodash';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './Viewer/SideBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="xl:container w-full flex flex-wrap mx-auto px-2">
        <div className="w-1/5 text-xl text-gray-800 leading-normal dark:text-gray-50 relative">
          <div className="sticky top-0 h-screen overflow-auto">
            <SideBar />
          </div>
        </div>

        <div className="w-4/5 p-8 text-gray-900 bg-white border border-gray-400 dark:text-gray-50 dark:bg-gray-800 dark:border-gray-400">
          <Outlet />
        </div>
      </div>
    </DndProvider>
  );
}

export default Home;
