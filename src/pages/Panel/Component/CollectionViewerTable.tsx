import React, { useEffect, useMemo } from 'react';
import { ICollectionItem, IViewingOption } from '../../../common/interface';
import {
  Column,
  ColumnDef,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import { Setting } from '../../../common/storage';
import _ from 'lodash';
import { Tooltip } from 'react-tooltip';
import TableEditableCell from './TableEditableCell';
import ImageTooltip from './ImageTooltip';

interface Prop {
  data: Array<ICollectionItem>;
  onDeleteItem: (_itemId: string) => Promise<void>;
  hiddenColumnsProp: string[];
  spacingProp: string;
  sortByProp: SortingState;
  timeDisplayProp: number;
  onEditItem: (_itemId: string, _content: string) => Promise<void>;
}

function CollectionViewerTable({
  data,
  onDeleteItem,
  hiddenColumnsProp,
  spacingProp,
  sortByProp,
  timeDisplayProp,
  onEditItem,
}: Prop) {
  const [spacing, setSpacing] = React.useState<string>('normal');

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleSpacingSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;
    setSpacing(value);

    Setting.updateViewingSpacing(value);
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
            let extension = row.content.match(/\.(jpeg|jpg|gif|png)$/);
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
      },
      {
        header: 'Created Time',
        meta: {
          className: 'text-center w-36 whitespace-nowrap',
        },
        accessorFn: (row) => {
          let _moment = moment(row.createTime);

          if (timeDisplayProp == 1 || null) {
            return _moment.format('YYYY-MM-DD HH:mm');
          }

          if (timeDisplayProp == 2 || null) {
            return _moment.fromNow();
          }

          //always return 12-hour clock
          return _moment.format('YYYY-MM-DD hh:mm A');
        },
        sortingFn: (a: Row<ICollectionItem>, b: Row<ICollectionItem>) => {
          var _a = moment(a.original.createTime);
          var _b = moment(b.original.createTime);
          if (_a.isSameOrBefore(_b)) {
            return 1;
          } else {
            return -1;
          }
        },
      },
      {
        header: 'Last Modified',
        meta: {
          className: 'text-center w-36 whitespace-nowrap',
        },
        accessorFn: (row) => {
          let _moment = moment(row.modifyTime);

          if (timeDisplayProp == 1) {
            return _moment.format('YYYY-MM-DD HH:mm');
          }

          if (timeDisplayProp == 2) {
            return _moment.fromNow();
          }

          //always return 12-hour clock
          return _moment.format('YYYY-MM-DD hh:mm A');
        },
        sortingFn: (a: Row<ICollectionItem>, b: Row<ICollectionItem>) => {
          var _a = moment(a.original.modifyTime);
          var _b = moment(b.original.modifyTime);
          if (_a.isSameOrBefore(_b)) {
            return 1;
          } else {
            return -1;
          }
        },
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
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
              if (confirmBox === true) {
                onDeleteItem(row.id);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        ),
      },
    ],
    [onDeleteItem]
  );

  const defaultColumn: Partial<ColumnDef<ICollectionItem>> = {
    cell: (props) => (
      <TableEditableCell
        value={props.getValue()}
        row={props.row}
        column={props.column.columnDef}
        onEditItem={onEditItem}
      />
    ),
  };

  const { getAllLeafColumns, getHeaderGroups, getRowModel } =
    useReactTable<ICollectionItem>({
      columns,
      data,
      defaultColumn,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onSortingChange: setSorting,
      state: {
        columnVisibility,
        sorting,
      },
    });

  useEffect(() => {
    let _hiddenColumnsKeys = _.keys(
      _.pickBy(columnVisibility, (value) => value == false)
    );

    Setting.updateViewingHiddenColumns(_hiddenColumnsKeys);
  }, [columnVisibility]);

  useEffect(() => {
    let _sorting = sorting || [];
    Setting.updateViewingSortBy(_sorting);
  }, [sorting]);

  useEffect(() => {
    if (hiddenColumnsProp != undefined) {
      // Update the above code to the following:
      const _columnVisibility: Record<string, boolean> = {};

      hiddenColumnsProp.forEach((value: string) => {
        _columnVisibility[value] = false;
      });

      setColumnVisibility(_columnVisibility);
    }

    if (sortByProp != undefined) {
      setSorting(sortByProp);
    }
  }, [hiddenColumnsProp, sortByProp]);

  useEffect(() => {
    setSpacing(spacingProp);
  }, [spacingProp]);

  return (
    <div className="">
      <div className="w-full">
        <div className="w-4/6 inline-block">
          {getAllLeafColumns().map((column) => (
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
            value={spacing}
            onChange={handleSpacingSelection}
          >
            <option value="normal">Normal</option>
            <option value="compact">Compact</option>
          </select>
        </div>
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

      <table className="table-auto w-full max-w-full text-base divide-y-2 divide-gray-200 dark:divide-gray-500">
        <thead>
          {getHeaderGroups().map((headerGroup) => (
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 inline ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        ),
                        desc: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 inline ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
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
          {getRowModel().rows.map((row) => {
            return (
              <tr
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => {
                  // console.log(cell.getContext());
                  return (
                    <td
                      className={`${spacing == 'normal' ? 'py-4' : 'py-1'} ${
                        cell.column.columnDef.meta?.className ?? ''
                      }`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CollectionViewerTable;
