import { Button } from '@/components/ui/button';
import React from 'react';
import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDownAZIcon, ArrowUpAZIcon } from 'lucide-react';

interface Props<TData> {
  table: Table<TData>;
}

function SortSelector<TData>({ table }: Props<TData>) {
  const sorting = table.getState().sorting;

  const handleDescendingOption = () => {
    if (sorting.length === 0) {
      return;
    }

    const currentSort = sorting[0];

    table.setSorting([
      {
        id: currentSort.id,
        desc: !currentSort.desc,
      },
    ]);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={String(sorting.length > 0 ? sorting[0].id : '')}
        onValueChange={(value) => {
          const column = table.getColumn(value);
          if (column) {
            table.setSorting([{ id: column.id, desc: false }]);
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sorting" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sorting</SelectLabel>
            {table
              .getAllColumns()
              .filter((column) => column.getCanSort())
              .map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.id}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleDescendingOption}>
        {sorting.length > 0 && sorting[0].desc ? (
          <ArrowDownAZIcon />
        ) : (
          <ArrowUpAZIcon />
        )}
      </Button>
    </div>
  );
}

export default SortSelector;
