import React from 'react';
import { useDrag } from 'react-dnd';
import { ICollectionItem } from '../../../../common/interface';
import { Row, flexRender } from '@tanstack/react-table';
import { Bars3Icon } from '@heroicons/react/24/outline';

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
    <tr
      className={`hover:bg-gray-200 dark:hover:bg-gray-700
      ${isDragging ? 'opacity-50' : ''}
      `}
      key={row.id}
      ref={previewRef}
    >
      <td ref={dragRef} className="w-1 cursor-pointer">
        <Bars3Icon className="w-5 h-5" strokeWidth={2} />
      </td>
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            className={`${cell.column.columnDef.meta?.className ?? ''}`}
            key={cell.id}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}

export default RowItem;
