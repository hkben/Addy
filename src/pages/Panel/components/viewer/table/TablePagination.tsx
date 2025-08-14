import { Button } from '@/components/ui/button';
import {
  ChevronsRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
} from 'lucide-react';
import React from 'react';
import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';

interface Props<TData> {
  table: Table<TData>;
}

function TablePagination<TData>({ table }: Props<TData>) {
  return (
    <div className="w-full flex justify-between items-center gap-2">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeftIcon />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRightIcon />
        </Button>

        <Select
          value={String(table.getState().pagination.pageIndex)}
          onValueChange={(pageIndex) => table.setPageIndex(Number(pageIndex))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Page</SelectLabel>
              {Array.from({ length: table.getPageCount() }, (_, pageIndex) => (
                <SelectItem key={pageIndex} value={String(pageIndex)}>
                  {pageIndex + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-muted-foreground text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount().toLocaleString()}
        </div>

        <div className="text-muted-foreground text-sm">
          Showing #
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{' '}
          of {table.getFilteredRowModel().rows.length.toLocaleString()} rows
        </div>

        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(pageSize) => table.setPageSize(Number(pageSize))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rows Per Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rows Per Page</SelectLabel>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  Show {pageSize} Rows
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default TablePagination;
