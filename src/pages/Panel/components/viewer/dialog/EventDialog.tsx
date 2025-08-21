import React, { useEffect } from 'react';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useDialogEventStore,
  DialogEventType,
} from '@/common/store/useDialogEventStore';
import { BrushCleaningIcon, Trash2Icon, TrashIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DialogAttributes {
  title: string;
  message: string;
  buttonContent: React.ReactNode;
}

const stateMap: Partial<Record<DialogEventType, DialogAttributes>> = {
  [DialogEventType.Delete]: {
    title: 'Delete Item',
    message: 'Do you really want to delete this item?',
    buttonContent: (
      <>
        <Trash2Icon />
        <span>Delete</span>
      </>
    ),
  },
  [DialogEventType.EmptyCollection]: {
    title: 'Empty Collection',
    message: 'Do you really want to delete all items in this collection?',
    buttonContent: (
      <>
        <BrushCleaningIcon />
        <span>Empty</span>
      </>
    ),
  },
  [DialogEventType.DeleteCollection]: {
    title: 'Delete Collection',
    message: 'Do you really want to delete this collection?',
    buttonContent: (
      <>
        <TrashIcon />
        <span>Delete</span>
      </>
    ),
  },
};

function EventDialog() {
  const event = useDialogEventStore((state) => state.event);

  const resetDialogEvent = useDialogEventStore(
    (state) => state.resetDialogEvent
  );

  const [isOpen, setIsOpen] = React.useState(false);

  let removeCollectionItem = useCollectionStore(
    (state) => state.removeCollectionItem
  );

  let removeAllItems = useCollectionStore((state) => state.removeAllItems);

  let removeCollection = useCollectionStore((state) => state.removeCollection);

  const navigate = useNavigate();

  const handleAction = () => {
    if (event == null || !event.collectionId) {
      return;
    }

    switch (event.type) {
      case DialogEventType.Delete:
        removeCollectionItem(event.collectionId, event.itemId!);
        break;
      case DialogEventType.EmptyCollection:
        removeAllItems(event.collectionId);
        break;
      case DialogEventType.DeleteCollection:
        removeCollection(event.collectionId);
        break;
      default:
        break;
    }

    setIsOpen(false);

    if (event.type === DialogEventType.DeleteCollection) {
      navigate('/');
    }
  };

  const handleonOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      resetDialogEvent();
    }
  };

  useEffect(() => {
    if (event == null) {
      return;
    }

    // Only handle these event types
    if (
      event.type === DialogEventType.Delete ||
      event.type === DialogEventType.EmptyCollection ||
      event.type === DialogEventType.DeleteCollection
    ) {
      setIsOpen(true);
    }
  }, [event]);

  if (event == null || !stateMap[event.type]) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleonOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{stateMap[event.type]!.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {stateMap[event.type]!.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleAction}
          >
            {stateMap[event.type]!.buttonContent}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EventDialog;
