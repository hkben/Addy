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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import RowItem from '@Panel/components/viewer/RowItem';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import { useParams } from 'react-router-dom';
import useSettingStore from '@/common/store/useSettingStore';

interface Prop {
  data: Array<ICollectionItem>;
}

function CollectionViewerTable({ data }: Prop) {
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

  const handleSpacingSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;

    let viewingOption = { ...setting!.viewingOption };
    viewingOption.spacing = value;

    await updateSetting({ viewingOption });
  };

  const columns: ColumnDef<ICollectionItem>[] = useMemo(
    () => [
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
        header: 'Source',
        meta: {
          className: 'text-center w-20',
        },
        accessorFn: (row) => (
          <a
            className="inline-block align-middle"
            href={row.source}
            target="_blank"
          >
            <ArrowTopRightOnSquareIcon className="h-6 w-6" strokeWidth={2} />
          </a>
        ),
      },
      {
        header: 'Delete',
        meta: {
          className: 'text-center w-20',
        },
        accessorFn: (row) => (
          <button
            className="inline-block align-middle"
            onClick={() => {
              const confirmBox = window.confirm(
                'Do you really want to delete this item?'
              );
              if (confirmBox === true && collectionId != null) {
                removeCollectionItem(collectionId, row.id);
              }
            }}
          >
            <XCircleIcon className="h-6 w-6" strokeWidth={2} />
          </button>
        ),
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
    <div className="">
      <div className="w-full">
        <div className="w-4/6 inline-block">
          {table.getAllLeafColumns().map((column) => (
            <div key={column.id} className="inline-block text-base p-2">
              <input
                type="checkbox"
                className="w-4 h-4 border border-gray-200 rounded-md"
                {...{
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler(),
                }}
              />
              <span className="ml-3 font-semibold">{column.id}</span>
            </div>
          ))}
        </div>

        <div className="w-2/6 inline-block text-base ml-auto my-auto align-top text-right">
          <label className="px-4" htmlFor="spaceing">
            Spacing
          </label>

          <select
            className="h-10 px-4 pr-10 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="spaceing"
            value={setting!.viewingOption?.spacing ?? 'normal'}
            onChange={handleSpacingSelection}
          >
            <option value="normal">Normal</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>

      <div className="w-full">
        <input
          className="w-2/6 p-2 mt-2 mb-4 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search Rows..."
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
              <th className="h-16 py-4 text-md whitespace-pre"></th>
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

      <div className="w-full flex mt-4">
        <div className="w-5/6 flex gap-2">
          <button
            className="p-2 px-3 text-base text-white rounded-md items-center cursor-pointer border"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="p-2 px-3 text-base text-white rounded-md items-center cursor-pointer border"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="p-2 px-3 text-base text-white rounded-md items-center cursor-pointer border"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="p-2 px-3 text-base text-white rounded-md items-center cursor-pointer border"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <div className="inline-block text-base ml-2">
            <span className="items-center gap-1">
              Page
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="items-center">| Go to page:</span>
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="placeholder:italic p-2 pr-3  border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800 ml-2"
            />
          </div>
        </div>

        <div className="w-1/6 text-base align-top text-right">
          <select
            className="h-10 px-4 pr-10 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full mt-2">
        <div className="text-base">
          <p>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Rows
          </p>
        </div>
      </div>
    </div>
  );
}

export default CollectionViewerTable;
