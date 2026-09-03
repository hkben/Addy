import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { ArrowDownUp, ChevronDownIcon, Columns3Icon } from 'lucide-react';
import React from 'react';
import ColumnsReorderDialog from '../dialog/ColumnsReorderDialog';
import {
  DialogEventType,
  useDialogEventStore,
} from '@/common/store/useDialogEventStore';

interface Props<TData> {
  table: Table<TData>;
}

function ColumnsSelector<TData>({ table }: Props<TData>) {
  const { setDialogEvent } = useDialogEventStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex justify-between w-40">
            <Columns3Icon />
            <span>Columns</span>
            <ChevronDownIcon className="size-4 opacity-50 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();

              setDialogEvent({
                type: DialogEventType.ColumnReorder,
              });
            }}
          >
            <ArrowDownUp />
            Reorder Columns
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  {column.columnDef.meta?.name ?? column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      <ColumnsReorderDialog table={table} />
    </>
  );
}

export default ColumnsSelector;
