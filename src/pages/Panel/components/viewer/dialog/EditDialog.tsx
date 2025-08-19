import React, { useCallback, useEffect } from 'react';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import {
  useDialogEventStore,
  DialogEventType,
} from '@/common/store/useDialogEventStore';
import { CopyIcon, RefreshCwIcon, SaveIcon, UnlinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ICollectionItem } from '@/common/interface';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import _ from 'lodash';
import log from 'loglevel';
import Common from '@/common/common';

function EditDialog() {
  const collection = useCollectionStore((state) => state.collection);

  const editCollectionItem = useCollectionStore(
    (state) => state.editCollectionItem
  );

  const event = useDialogEventStore((state) => state.event);

  const resetDialogEvent = useDialogEventStore(
    (state) => state.resetDialogEvent
  );

  const [item, setItem] = React.useState<ICollectionItem>();

  const [isOpen, setIsOpen] = React.useState(false);

  const handleEditItem = () => {
    if (event == null || item == null) {
      return;
    }

    const originalItem = collection.items.find((i) => i.id === event.itemId);

    if (originalItem == null) {
      log.error('[EditDialog] Original item not found');
      return;
    }

    const isEqual = _.isEqual(item, originalItem);

    if (isEqual) {
      log.debug('[EditDialog] No changes detected, closing dialog');
      setIsOpen(false);
      return;
    }

    const changes = Common.getChangedProps(item, originalItem);

    log.debug('[EditDialog] Changes detected:', changes);

    editCollectionItem(collection.id, item.id, changes);

    setIsOpen(false);
  };

  const handleonOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      resetDialogEvent();
    }
  };

  const setInitialItem = useCallback(() => {
    if (
      event == null ||
      event.type !== DialogEventType.Edit ||
      event.collectionId == null ||
      event.itemId == null
    ) {
      return;
    }

    const originalItem = collection.items.find((i) => i.id === event.itemId);

    if (originalItem == null) {
      return;
    }

    setItem(originalItem);
  }, [event, collection.items]);

  useEffect(() => {
    if (event == null || event.type !== DialogEventType.Edit) {
      return;
    }

    setInitialItem();
    setIsOpen(true);
  }, [event, setInitialItem]);

  if (!item) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleonOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div className="grid items-center gap-4">
          <div className="grid w-full items-center gap-3 flex-1">
            <Label htmlFor="id">Item ID</Label>
            <span className="text-sm font-medium text-muted-foreground">
              {item.id}
            </span>
          </div>

          <div className="flex w-full items-center gap-3">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="createTime">Create Time</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {new Date(item.createTime).toLocaleString()}
              </span>
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="modifyTime">Modify Time</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {new Date(item.modifyTime).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="type">Type</Label>
            <Select
              value={item.type}
              onValueChange={(value) => {
                setItem({ ...item, type: value as ICollectionItem['type'] });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="text">📝 Text</SelectItem>
                  <SelectItem value="image">🖼️ Image</SelectItem>
                  <SelectItem value="bookmark">🔖 Bookmark</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="source">Source</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  if (item == null || item.source == null) {
                    return;
                  }

                  await navigator.clipboard.writeText(item.source);
                }}
              >
                <CopyIcon />
                Copy Source
              </Button>
            </div>
            <Input
              type="text"
              id="source"
              placeholder="Source"
              value={item.source}
              onChange={(e) => {
                const value = e.target.value;

                if (item == null) {
                  return;
                }

                setItem({ ...item, source: value });
              }}
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="content">Content</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  if (item == null || item.content == null) {
                    return;
                  }

                  await navigator.clipboard.writeText(item.content);
                }}
              >
                <CopyIcon />
                Copy Content
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (item == null || item.content == null) {
                    return;
                  }

                  const decodedContent = decodeURIComponent(item.content);
                  setItem({ ...item, content: decodedContent });
                }}
              >
                <UnlinkIcon />
                Decode URL
              </Button>
            </div>
            <Textarea
              className="h-32"
              id="content"
              placeholder="Content"
              value={item.content}
              onChange={(e) => {
                const value = e.target.value;

                if (item == null) {
                  return;
                }

                setItem({ ...item, content: value });
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleEditItem}>
            <SaveIcon />
            Save changes
          </Button>
          <Button type="button" variant="secondary" onClick={setInitialItem}>
            <RefreshCwIcon />
            Reset
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
