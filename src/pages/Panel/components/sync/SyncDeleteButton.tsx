import React, { Fragment } from 'react';
import { BrowserMessageAction } from '@/common/interface';
import log from 'loglevel';
import { SyncState, useSyncStore } from '@/common/store/useSyncStore';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  CloudAlertIcon,
  CloudCheckIcon,
  CloudOffIcon,
  RefreshCwIcon,
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

  const message = useSyncStore((state) => state.message);

  const handleOnClick = async () => {
    startSyncAction(BrowserMessageAction.SyncFileDeletion);
  };

  const renderText = () => {
    if (
      action !== BrowserMessageAction.SyncFileDeletion ||
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
            <RefreshCwIcon className="animate-spin" />
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

  const messageContent = () => {
    if (
      syncingState === SyncState.Error &&
      action === BrowserMessageAction.SyncFileDeletion
    )
      return (
        <p className="text-destructive text-sm mt-2">
          {message || 'An error occurred during sync.'}
        </p>
      );
  };

  return (
    <>
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
              Are you sure you want to delete all remote data? This action
              cannot be undone.
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
      {messageContent()}
    </>
  );
}

export default SyncDeleteButton;
