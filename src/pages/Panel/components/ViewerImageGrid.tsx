import React, { useEffect, useMemo } from 'react';
import { ICollectionItem } from '@/common/interface';
import { isBefore, isEqual } from 'date-fns';
import _ from 'lodash';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import ImageItem from '@Panel/components/viewer/ImageItem';
import useSettingStore from '@/common/store/useSettingStore';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import GridOption from './viewer/grid/GridOption';
import TablePagination from './viewer/table/TablePagination';


function ViewerImageGrid() {
  let collection = useCollectionStore((state) => state.collection);

  let data = useMemo(() => {
    return collection?.items.filter((item) => item.type === 'image') || [];
  }, [collection]);

  const { setting, updateSetting } = useSettingStore();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      // Initialize column visibility on component mount
      const _columnVisibility: VisibilityState = {};

      setting!.viewingOption.hiddenColumns.forEach((value: string) => {
        _columnVisibility[value] = false;
      });

      return _columnVisibility;
    });

  const [sorting, setSorting] = React.useState<SortingState>(() => {
    // Initialize sorting state on component mount
    return setting!.viewingOption.sortBy || [];
  });

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: setting!.viewingOption.pageSize || 20,
  });

  const [globalFilter, setGlobalFilter] = React.useState('');

  const numberOfItems = setting!.viewingOption.imageColumns ?? 3;

  const columns: ColumnDef<ICollectionItem>[] = useMemo(
    () => [
      {
        header: 'Content',
        accessorFn: (row) => {
          return row.content;
        },
      },
      {
        header: 'Created Time',
        accessorFn: (row) => {
          return row.createTime;
        },
        sortingFn: (a: Row<ICollectionItem>, b: Row<ICollectionItem>) => {
          var _a = a.original.createTime;
          var _b = b.original.createTime;
          if (isBefore(_a, _b) || isEqual(_a, _b)) {
            return 1;
          } else {
            return -1;
          }
        },
        enableGlobalFilter: false,
      },
      {
        header: 'Last Modified',
        accessorFn: (row) => {
          return row.modifyTime;
        },
        sortingFn: (a: Row<ICollectionItem>, b: Row<ICollectionItem>) => {
          var _a = a.original.modifyTime;
          var _b = b.original.modifyTime;
          if (isBefore(_a, _b) || isEqual(_a, _b)) {
            return 1;
          } else {
            return -1;
          }
        },
        enableGlobalFilter: false,
      },
    ],
    []
  );

  const table = useReactTable<ICollectionItem>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: {
      columnVisibility,
      sorting,
      pagination,
      globalFilter,
    },
  });

  useEffect(() => {
    let updateHiddenColumns = async () => {
      let _hiddenColumnsKeys = _.keys(
        _.pickBy(columnVisibility, (value) => value == false)
      );

      let viewingOption = { ...setting!.viewingOption };

      // If new hidden columns are equal to the current hidden columns, do nothing
      if (_.isEqual(viewingOption.hiddenColumns, _hiddenColumnsKeys)) {
        return;
      }

      viewingOption.hiddenColumns = _hiddenColumnsKeys;

      await updateSetting({ viewingOption });
    };

    updateHiddenColumns();
  }, [columnVisibility]);

  useEffect(() => {
    let updateSorting = async () => {
      let _sorting = sorting || [];

      let viewingOption = { ...setting!.viewingOption };

      // If new sorting is equal to the current sorting, do nothing
      if (_.isEqual(viewingOption.sortBy, _sorting)) {
        return;
      }

      viewingOption.sortBy = _sorting;

      await updateSetting({ viewingOption });
    };

    updateSorting();
  }, [sorting]);

  useEffect(() => {
    let updatePagination = async () => {
      let viewingOption = { ...setting!.viewingOption };

      // If new page size is equal to the current page size, do nothing
      if (viewingOption.pageSize === pagination.pageSize) {
        return;
      }

      viewingOption.pageSize = pagination.pageSize;

      await updateSetting({ viewingOption });
    };

    updatePagination();
  }, [pagination]);
  return (
    <div className="w-full">
      <div className="w-full mb-4">
        <GridOption
          table={table}
          onKeywordChange={(value) => setGlobalFilter(value)}
        />
      </div>

      <div>
        <div className={`py-3 grid gap-2 grid-cols-${numberOfItems}`}>
          {table.getRowModel().rows.map((row) => (
            <ImageItem key={row.id} item={row.original} />
          ))}
        </div>
      </div>

      <div className="w-full mt-8">
        <TablePagination table={table} />
      </div>
    </div>
  );
}

export default ViewerImageGrid;
