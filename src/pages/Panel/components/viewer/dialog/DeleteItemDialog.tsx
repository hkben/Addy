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
import { Trash2Icon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

function DeleteItemDialog() {
  const event = useDialogEventStore((state) => state.event);

  const resetDialogEvent = useDialogEventStore(
    (state) => state.resetDialogEvent
  );

  const [isOpen, setIsOpen] = React.useState(false);

  let removeCollectionItem = useCollectionStore(
    (state) => state.removeCollectionItem
  );

  const handleDeleteItem = () => {
    if (event == null) {
      return;
    }

    if (event.collectionId) {
      removeCollectionItem(event.collectionId, event.itemId!);
      setIsOpen(false);
      resetDialogEvent();
    }
  };

  useEffect(() => {
    if (event == null) {
      return;
    }

    if (event.type === DialogEventType.Delete) {
      setIsOpen(true);
    }
  }, [event]);

  useEffect(() => {
    if (isOpen === false) {
      resetDialogEvent();
    }
  }, [isOpen, resetDialogEvent]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Item</AlertDialogTitle>
          <AlertDialogDescription>
            Do you really want to delete this item?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleDeleteItem}
          >
            <Trash2Icon />
            <span>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteItemDialog;
