import React, { useEffect, useMemo } from 'react';
import { ICollectionItem } from '@/common/interface';
import {
  Column,
  ColumnDef,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { isBefore, isEqual, formatDistanceToNow, format } from 'date-fns';
import { Setting } from '../../../common/storage';
import _ from 'lodash';
import { Tooltip } from 'react-tooltip';
import TableEditableCell from './TableEditableCell';
import ImageTooltip from './ImageTooltip';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import RowItem from '@Panel/components/viewer/RowItem';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import { useParams } from 'react-router-dom';
import useSettingStore from '@/common/store/useSettingStore';
import TableOption from './viewer/table/TableOption';
import TablePagination from './viewer/table/TablePagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LinkIcon, MenuIcon, MoreHorizontal, Trash2Icon } from 'lucide-react';

interface Prop {
  type?: 'image' | 'text' | 'bookmark';
}

function ViewerTable({ type }: Prop) {
  let collection = useCollectionStore((state) => state.collection);

  let data = useMemo(() => {
    if (type === undefined) {
      return collection?.items || [];
    }

    return collection?.items.filter((item) => item.type === type) || [];
  }, [collection, type]);

  let { collectionId } = useParams();

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

  let removeCollectionItem = useCollectionStore(
    (state) => state.removeCollectionItem
  );

  const columns: ColumnDef<ICollectionItem>[] = useMemo(
    () => [
      {
        id: 'drag',
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: 'w-10 cursor-pointer select-none px-2',
        },
        cell: ({ row }) => {
          return <MenuIcon className="size-5" />;
        },
        enableGlobalFilter: false,
      },
      {
        header: 'Content',
        meta: {
          className: 'whitespace-pre-line px-2 max-w-lg break-all',
        },
        accessorFn: (row) => {
          //Hide Base64 Image Text
          if (row.content.startsWith('data:image')) {
            const text = `<Base64 Image>`;
            return <p data-tip={row.content}>{text}</p>;
          }

          if (row.type == 'image') {
            let extension = row.content.match(
              /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/
            );
            let type = 'Unknown';

            if (extension != null) {
              type = extension[1].toUpperCase();
            }
            const { hostname } = new URL(row.content);
            const text = `<${type} Image from ${hostname} >`;

            return (
              <p
                data-tooltip-id="tooltip"
                data-tooltip-content={row.content}
                data-type="image"
              >
                {text}
              </p>
            );
          }

          return row.content;
        },
      },
      {
        header: 'Type',
        meta: {
          className: 'text-center',
        },
        accessorFn: (row) => row.type,
        enableGlobalFilter: false,
      },
      {
        header: 'Created Time',
        meta: {
          className: 'text-center w-36 whitespace-nowrap',
        },
        accessorFn: (row) => {
          let _fromNow = formatDistanceToNow(row.createTime, {
            addSuffix: true,
          });
          let _24Hour = format(row.createTime, 'yyyy-MM-dd HH:mm');
          let _12Hour = format(row.createTime, 'yyyy-MM-dd hh:mm a');

          if (setting!.viewingOption?.timeDisplay == 1) {
            return (
              <span data-tooltip-id="tooltip" data-tooltip-content={_fromNow}>
                {_24Hour}
              </span>
            );
          }

          if (setting!.viewingOption?.timeDisplay == 2) {
            return (
              <span data-tooltip-id="tooltip" data-tooltip-content={_12Hour}>
                {_fromNow}
              </span>
            );
          }

          //always return 12-hour clock
          return (
            <span data-tooltip-id="tooltip" data-tooltip-content={_fromNow}>
              {_12Hour}
            </span>
          );
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
        meta: {
          className: 'text-center w-36 whitespace-nowrap',
        },
        accessorFn: (row) => {
          let _fromNow = formatDistanceToNow(row.modifyTime, {
            addSuffix: true,
          });
          let _24Hour = format(row.modifyTime, 'yyyy-MM-dd HH:mm');
          let _12Hour = format(row.modifyTime, 'yyyy-MM-dd hh:mm a');

          if (setting!.viewingOption?.timeDisplay == 1) {
            return (
              <span data-tooltip-id="tooltip" data-tooltip-content={_fromNow}>
                {_24Hour}
              </span>
            );
          }

          if (setting!.viewingOption?.timeDisplay == 2) {
            return (
              <span data-tooltip-id="tooltip" data-tooltip-content={_12Hour}>
                {_fromNow}
              </span>
            );
          }

          //always return 12-hour clock
          return (
            <span data-tooltip-id="tooltip" data-tooltip-content={_fromNow}>
              {_12Hour}
            </span>
          );
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
      {
        id: 'action',
        meta: {
          className: 'w-10',
        },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]" align="end">
                {/* <DropdownMenuItem
                 className="cursor-pointer"
                 >
                  <FileCodeIcon />
                  <span>Edit</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <a
                    href={row.original.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon />
                    <span>View Source</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      'Do you really want to delete this item?'
                    );
                    if (confirmBox === true && collectionId != null) {
                      removeCollectionItem(collectionId, row.original.id);
                    }
                  }}
                >
                  <Trash2Icon />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableGlobalFilter: false,
      },
    ],
    [collectionId, removeCollectionItem, setting!.viewingOption?.timeDisplay]
  );

  const defaultColumn: Partial<ColumnDef<ICollectionItem>> = {
    cell: (props) => (
      <TableEditableCell
        value={props.getValue()}
        row={props.row}
        column={props.column.columnDef}
      />
    ),
  };

  const table = useReactTable<ICollectionItem>({
    columns,
    data,
    defaultColumn,
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
        <TableOption
          table={table}
          onKeywordChange={(value) => setGlobalFilter(value)}
        />
      </div>

      <Tooltip
        id="tooltip"
        place="top"
        render={({ content, activeAnchor }) => {
          let type = activeAnchor?.getAttribute('data-type') ?? 'text';

          if (type == 'image') {
            return <ImageTooltip imageSrc={content ?? ''} />;
          }

          return <span>{content}</span>;
        }}
      />

      <table
        className={`table-auto w-full max-w-full text-base divide-y-2 divide-gray-200 dark:divide-gray-500 ${
          setting!.viewingOption?.spacing == 'normal'
            ? 'table-td-y-4'
            : 'table-td-y-1'
        }`}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="h-16 py-4 text-md whitespace-pre"
                  key={header.id}
                  colSpan={header.colSpan}
                >
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span>
                      {{
                        asc: (
                          <ChevronDownIcon
                            className="h-6 w-6 inline ml-2"
                            strokeWidth={2}
                          />
                        ),
                        desc: (
                          <ChevronUpIcon
                            className="h-6 w-6 inline ml-2"
                            strokeWidth={2}
                          />
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
          {table.getRowModel().rows.map((row) => (
            <RowItem key={row.id} row={row} />
          ))}
        </tbody>
      </table>

      <div className="w-full mt-8">
        <TablePagination table={table} />
      </div>
    </div>
  );
}

export default ViewerTable;
