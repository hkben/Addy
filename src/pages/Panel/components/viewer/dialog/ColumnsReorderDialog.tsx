import {
  DialogEventType,
  useDialogEventStore,
} from '@/common/store/useDialogEventStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table } from '@tanstack/react-table';
import { RotateCcw, SaveIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ColumnsReorderItem from './ColumnsReorderItem';

interface Props<TData> {
  table: Table<TData>;
  onOpenChange?: (open: boolean) => void;
}

function ColumnsReorderDialog<TData>({ table }: Props<TData>) {
  const event = useDialogEventStore((state) => state.event);

  const resetDialogEvent = useDialogEventStore(
    (state) => state.resetDialogEvent
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const [ordering, setOrdering] = useState(() => {
    const currentOrder = table.getState().columnOrder as string[];

    return currentOrder.length > 0
      ? currentOrder
      : table.getAllColumns().map((column) => column.id);
  });

  const [columns, setColumns] = useState(() => {
    const columns = table.getAllColumns();
    return columns;
  });

  const moveOrdering = (dragId: string, hoverId: string) => {
    if (dragId === hoverId) {
      return;
    }

    var dargIndex = columns.findIndex((column) => column.id === dragId);

    var hoverIndex = columns.findIndex((column) => column.id === hoverId);

    const newOrder = [...columns];

    const [draggedColumn] = newOrder.splice(dargIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedColumn);

    setColumns(newOrder);
    setOrdering(newOrder.map((column) => column.id));
  };

  useEffect(() => {
    const currentOrder = table.getState().columnOrder as string[];
    setOrdering(currentOrder);
  }, [table]);

  const handleonOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      resetDialogEvent();
    }
  };

  useEffect(() => {
    if (event == null || event.type !== DialogEventType.ColumnReorder) {
      return;
    }

    setIsOpen(true);
  }, [event]);

  if (event == null || event.type !== DialogEventType.ColumnReorder) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleonOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Column Reordering</DialogTitle>
          <DialogDescription>
            Drag and drop the columns to reorder them. Click "Save changes" to
            apply the new order.
          </DialogDescription>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {columns.map((column) => (
            <ColumnsReorderItem
              key={column.id}
              column={column}
              onDrop={moveOrdering}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={() => {
              table.setColumnOrder(ordering);
              setIsOpen(false);
            }}
          >
            <SaveIcon />
            Save changes
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              table.setColumnOrder([]);

              var columns = table.getAllColumns();
              var defaultOrder = columns.map((column) => column.id);

              setOrdering(defaultOrder);
              setColumns(columns);
            }}
          >
            <RotateCcw />
            Reset to Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ColumnsReorderDialog;
