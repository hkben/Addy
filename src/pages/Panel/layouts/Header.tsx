import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

function Header({ title, description, actions }: Props) {
  return (
    <header className="flex sticky top-0 h-14 shrink-0 items-center gap-2 bg-background border-b px-3">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <span className="text-muted-foreground hidden font-medium md:inline-block ml-2">
            {description}
          </span>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </header>
  );
}

export default Header;
