// This is just a template reference for the Content layout component
// Do not use this file directly in project

import { SidebarInset } from '@/components/ui/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Content: React.FC = () => {
  return (
    <SidebarInset>
      <Header title="Addy" />
      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="bg-muted/50 mx-auto h-full w-full max-w-5xl rounded-xl p-8">
          <Outlet />
        </div>
      </div>
    </SidebarInset>
  );
};

export default Content;
