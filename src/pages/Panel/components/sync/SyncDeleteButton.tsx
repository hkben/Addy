import React, { Fragment } from 'react';
import { BrowserMessageAction } from '@/common/interface';
import log from 'loglevel';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  CloudAlertIcon,
  CloudCheckIcon,
  CloudOffIcon,
  RefreshCcwIcon,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function SyncDeleteButton() {
  const syncingState = useSyncStore((state) => state.syncingState);

  const startSyncAction = useSyncStore((state) => state.startSyncAction);

  const action = useSyncStore((state) => state.action);

  const handleOnClick = async () => {
    startSyncAction(BrowserMessageAction.SyncBackgroundRun);
  };

  const renderText = () => {
    if (
      action !== BrowserMessageAction.SyncBackgroundRun ||
      syncingState === SyncState.Idle
    ) {
      return (
        <>
          <CloudOffIcon />
          <span>Delete Remote Data</span>
        </>
      );
    }

    switch (syncingState) {
      case SyncState.Running:
        return (
          <>
            <RefreshCcwIcon className="animate-spin" />
            <span>Deleting...</span>
          </>
        );
      case SyncState.Completed:
        return (
          <>
            <CloudCheckIcon />
            <span>Deletion Completed</span>
          </>
        );
      case SyncState.Error:
        return (
          <>
            <CloudAlertIcon />
            <span>Error</span>
          </>
        );
      default:
        return '';
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={syncingState === SyncState.Running}
        >
          {renderText()}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Remote Data</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all remote data? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleOnClick}
          >
            <CloudOffIcon />
            <span>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SyncDeleteButton;
