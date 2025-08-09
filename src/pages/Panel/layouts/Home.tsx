import _ from 'lodash';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Ellipsis, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function Home() {
  return (
    <SidebarInset>
      <header className="flex sticky top-0 h-14 shrink-0 items-center gap-2 bg-background border-b">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-lg font-semibold">Addy</h1>
        </div>
        <div className="ml-auto px-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="text-muted-foreground hidden font-medium md:inline-block">
              Placehoder
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Ellipsis />
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="bg-muted/50 mx-auto h-full w-full max-w-5xl rounded-xl p-8">
          <Outlet />
        </div>
      </div>
    </SidebarInset>
  );
}

export default Home;
