import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  BrushCleaningIcon,
  DownloadIcon,
  TrashIcon,
} from 'lucide-react';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import {
  DialogEventType,
  useDialogEventStore,
} from '@/common/store/useDialogEventStore';

function HeaderActions() {
  let collection = useCollectionStore((state) => state.collection);

  const setDialogEvent = useDialogEventStore((state) => state.setDialogEvent);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-accent h-7 w-7"
          >
            <MoreHorizontal />
          </Button>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]" align="end">
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
          <DownloadIcon />
          <span>Download All Images</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Danger Area</DropdownMenuLabel>

        <DropdownMenuItem
          className="cursor-pointer"
          variant="destructive"
          onClick={() => {
            setDialogEvent({
              type: DialogEventType.EmptyCollection,
              collectionId: collection.id,
            });
          }}
        >
          <BrushCleaningIcon />
          <span>Empty Collection</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          variant="destructive"
          onClick={() => {
            setDialogEvent({
              type: DialogEventType.DeleteCollection,
              collectionId: collection.id,
            });
          }}
        >
          <TrashIcon />
          <span>Delete Collection</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeaderActions;
