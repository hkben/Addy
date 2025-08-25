import React, { useCallback, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { BrowserMessageAction } from '@/common/interface';

interface Props extends React.PropsWithChildren {
  title: string;
  color?: number;
}

function Header({ title, color, children }: Props) {
  const sync = useSyncStore((state) => state.sync);

  const lastSyncTime = useSyncStore((state) => state.lastSyncTime);

  const syncingState = useSyncStore((state) => state.syncingState);

  const startSyncAction = useSyncStore((state) => state.startSyncAction);

  const [formatedLastSyncTime, setFormatedLastSyncTime] =
    React.useState<string>('');

  const updateLastSyncTime = useCallback(() => {
    if (lastSyncTime == null) {
      return;
    }

    setFormatedLastSyncTime(
      formatDistanceToNow(lastSyncTime, { addSuffix: true })
    );
  }, [lastSyncTime]);

  // timer for update last sync time every minute
  useEffect(() => {
    if (lastSyncTime == null) {
      return;
    }

    updateLastSyncTime();

    const interval = setInterval(() => {
      updateLastSyncTime();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [lastSyncTime, updateLastSyncTime]);

  const displaySyncInfo = () => {
    if (sync === false || lastSyncTime == null || formatedLastSyncTime === '') {
      return null;
    }

    return (
      <>
        <span className="text-xs text-muted-foreground hidden md:inline-block">
          Last Sync: {formatedLastSyncTime}
        </span>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => {
            startSyncAction(BrowserMessageAction.SyncBackgroundRun);
          }}
        >
          <RefreshCwIcon
            className={syncingState === SyncState.Running ? 'animate-spin' : ''}
          />
        </Button>
      </>
    );
  };

  return (
    <header className="flex sticky top-0 h-14 shrink-0 items-center gap-2 bg-background border-b px-3 z-5">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>
          {color !== undefined && color !== 0 ? (
            <span
              className={`mx-1 rounded-full inline-block h-3 w-3 color-${color}`}
            ></span>
          ) : null}
        </div>

        <div className="ml-auto px-3">
          <div className="flex items-center gap-2 text-sm">
            {displaySyncInfo()}

            {children}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
