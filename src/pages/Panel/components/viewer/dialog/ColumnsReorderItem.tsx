import { Button } from '@/components/ui/button';
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item';
import { Column } from '@tanstack/react-table';
import { Eye, EyeOff, GripVerticalIcon } from 'lucide-react';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface Props<TData> {
  column: Column<TData, unknown>;
  onDrop: (sourceColumnId: string, targetColumnId: string) => void;
}

interface DropItem {
  id: string;
}

function ColumnsReorderItem<TData>({ column, onDrop }: Props<TData>) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'column',
    item: { id: column.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: 'column',
    drop: (item: DropItem) => onDrop(item.id, column.id),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const connectDragAndDrop = (element: HTMLDivElement | null) => {
    dragRef(element);
    dropRef(element);
  };

  var isVisible = column.getIsVisible() === false;

  return (
    <Item
      variant={`${isVisible ? 'muted' : 'outline'}`}
      size="sm"
      ref={connectDragAndDrop}
      className={`cursor-move ${isDragging ? 'opacity-50' : ''} ${
        isOver ? 'border-primary' : ''
      }`}
    >
      <ItemMedia variant="icon">
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>
          <span className="flex-1 capitalize">
            {column.columnDef.meta?.name ?? column.id}
          </span>
        </ItemTitle>
      </ItemContent>

      <ItemActions>
        {column.getCanHide() && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => column.toggleVisibility(!column.getIsVisible())}
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </Button>
        )}
      </ItemActions>
    </Item>
  );
}

export default ColumnsReorderItem;
