import React from 'react';
import { useDrag } from 'react-dnd';
import { ICollectionItem } from '@/common/interface';
import { Row, flexRender } from '@tanstack/react-table';
import { TableCell, TableRow } from '@/components/ui/table';

interface Prop {
  row: Row<ICollectionItem>;
}

function RowItem({ row }: Prop) {
  const [{ isDragging }, dragRef, previewRef] = useDrag({
    type: 'row',
    item: () => {
      return {
        id: row.original.id,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <TableRow
      className={isDragging ? 'opacity-50' : ''}
      key={row.id}
      ref={previewRef}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell
            className={`${cell.column.columnDef.meta?.className ?? ''}`}
            key={cell.id}
            ref={cell.column.id === 'drag' ? dragRef : undefined}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export default RowItem;
