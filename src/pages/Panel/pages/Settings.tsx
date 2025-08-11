import { SidebarInset } from '@/components/ui/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../layouts/Header';

class Settings extends React.Component<{}> {
  render() {
    return (
      <SidebarInset>
        <Header title="Settings" />
        <div className="flex flex-1 flex-col gap-4 px-4 py-5">
          <div className="bg-muted/50 mx-auto h-full w-full max-w-5xl rounded-xl p-8">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    );
  }
}

export default Settings;
