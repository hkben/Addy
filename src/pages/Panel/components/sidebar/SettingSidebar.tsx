import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  BookOpenIcon,
  FolderInputIcon,
  FolderOutputIcon,
  FolderSyncIcon,
  InfoIcon,
  Settings2Icon,
  StarIcon,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export function SettingSidebar() {
  return (
    <>
      <SidebarContent className="mb-4">
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/setting/general">
                    <Settings2Icon />
                    <span>General</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/setting/sync">
                    <FolderSyncIcon />
                    <span>Sync</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/setting/export">
                    <FolderOutputIcon />
                    <span>Export</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/setting/import">
                    <FolderInputIcon />
                    <span>Import</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/setting/welcome">
                    <BookOpenIcon />
                    <span>Welcome Page</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/setting/information">
                    <InfoIcon />
                    <span>Information</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
