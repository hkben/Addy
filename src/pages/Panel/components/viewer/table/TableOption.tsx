import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon, SearchIcon } from 'lucide-react';
import React from 'react';
import ColumnsSelector from './ColumnsSelector';
import { Table } from '@tanstack/react-table';
import SpacingSelector from './SpacingSelector';

interface Props<TData> {
  table: Table<TData>;
  onKeywordChange: (value: string) => void;
}

function TableOption<TData>({ table, onKeywordChange }: Props<TData>) {
  const [keyword, setKeyword] = React.useState<string>('');

  React.useEffect(() => {
    onKeywordChange(keyword);
  }, [keyword, onKeywordChange]);

  return (
    <div className="flex flex-1 items-center gap-2">
      <div className="relative w-1/2">
        <div className="relative w-full">
          <Input
            className="pl-8 h-10"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Rows..."
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={() => {
              setKeyword('');
            }}
          >
            <XIcon />
          </Button>
        </div>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>

      <div className="ml-auto">
        <div className="flex items-center gap-2">
          <ColumnsSelector table={table} />
          <SpacingSelector />
        </div>
      </div>
    </div>
  );
}

export default TableOption;
