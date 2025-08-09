import React from 'react';
import { useDarkMode } from '@/common/hooks/useDarkMode';
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar } from '../components/sidebar/AppSidebar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SettingSidebar } from '../components/sidebar/SettingSidebar';
import { Button } from '@/components/ui/button';
import { List, Moon, SettingsIcon, Sun } from 'lucide-react';

function Layout() {
  const [darkMode, setDarkMode] = useDarkMode();

  const toggleDarkMode = async () => {
    let _darkMode = darkMode ? false : true;

    setDarkMode(_darkMode);
  };

  const location = useLocation();

  const isSettingPage = location.pathname.startsWith('/setting');

  const renderSettingsNavButton = () => {
    if (isSettingPage) {
      return (
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <List />
          </Link>
        </Button>
      );
    } else {
      return (
        <Button variant="ghost" size="icon" asChild>
          <Link to="/setting">
            <SettingsIcon />
          </Link>
        </Button>
      );
    }
  };

  const renderSidebarContent = () => {
    return isSettingPage ? <SettingSidebar /> : <AppSidebar />;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="py-0">
            <SidebarGroup>
              <SidebarGroupContent className="flex items-center justify-between">
                <Link
                  className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-700"
                  to="/"
                >
                  <img src="icon-34.png" alt="Addy" />
                </Link>

                <div className="flex">
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                    {darkMode ? <Sun /> : <Moon />}
                  </Button>
                  {renderSettingsNavButton()}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarHeader>
          {renderSidebarContent()}
        </Sidebar>
        <Outlet />
      </SidebarProvider>
    </DndProvider>
  );
}

export default Layout;
