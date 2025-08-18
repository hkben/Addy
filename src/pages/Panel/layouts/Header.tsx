import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

interface Props extends React.PropsWithChildren {
  title: string;
  color?: number;
  description?: string;
}

function Header({ title, color, description, children }: Props) {
  return (
    <header className="flex sticky top-0 h-14 shrink-0 items-center gap-2 bg-background border-b px-3">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>
          {color !== undefined && color !== 0 ? (
            <span
              className={`mx-1 rounded-full inline-block h-3 w-3 color-${color}`}
            ></span>
          ) : null}
        </div>

        <div className="ml-auto px-3">
          <div className="flex items-center gap-2 text-sm">
            {description && (
              <span className="text-muted-foreground hidden font-medium md:inline-block ml-2">
                {description}
              </span>
            )}
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
