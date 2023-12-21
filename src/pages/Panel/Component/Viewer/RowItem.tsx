import React from 'react';
import { useDrag } from 'react-dnd';
import { ICollectionItem } from '../../../../common/interface';
import { Row, flexRender } from '@tanstack/react-table';
import { Bars3Icon } from '@heroicons/react/24/outline';
import useViewingOptionStore from '../../../../common/hook/useViewingOptionStore';

interface Prop {
  row: Row<ICollectionItem>;
}

function RowItem({ row }: Prop) {
  const viewingOption = useViewingOptionStore((state) => state.viewingOption);

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
      <td ref={dragRef} className="cursor-pointer">
        <Bars3Icon className="w-5 h-5" strokeWidth={2} />
      </td>
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            className={`${
              viewingOption.spacing == 'normal' ? 'py-4' : 'py-1'
            } ${cell.column.columnDef.meta?.className ?? ''}`}
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
