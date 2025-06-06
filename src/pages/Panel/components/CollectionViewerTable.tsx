import React, { useEffect, useMemo } from 'react';
import { ICollectionItem } from '@/common/interface';
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

  let removeCollectionItem = useCollectionStore(
    (state) => state.removeCollectionItem
  );

  const handleSpacingSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;

    let viewingOption = setting!.viewingOption;
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
      },
      {
        header: 'Created Time',
        meta: {
          className: 'text-center w-36 whitespace-nowrap',
        },
        accessorFn: (row) => {
          let _moment = moment(row.createTime);
          let _fromNow = _moment.fromNow();
          let _24Hour = _moment.format('YYYY-MM-DD HH:mm');
          let _12Hour = _moment.format('YYYY-MM-DD hh:mm A');

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
          let _fromNow = _moment.fromNow();
          let _24Hour = _moment.format('YYYY-MM-DD HH:mm');
          let _12Hour = _moment.format('YYYY-MM-DD hh:mm A');

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
    let updateHiddenColumns = async () => {
      let _hiddenColumnsKeys = _.keys(
        _.pickBy(columnVisibility, (value) => value == false)
      );

      let viewingOption = setting!.viewingOption;
      viewingOption.hiddenColumns = _hiddenColumnsKeys;

      await updateSetting({ viewingOption });
    };

    updateHiddenColumns();
  }, [columnVisibility]);

  useEffect(() => {
    let updateSorting = async () => {
      let _sorting = sorting || [];

      let viewingOption = setting!.viewingOption;
      viewingOption.sortBy = _sorting;

      await updateSetting({ viewingOption });
    };

    updateSorting();
  }, [sorting]);

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
            value={setting!.viewingOption?.spacing ?? 'normal'}
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

      <table
        className={`table-auto w-full max-w-full text-base divide-y-2 divide-gray-200 dark:divide-gray-500 ${
          setting!.viewingOption?.spacing == 'normal'
            ? 'table-td-y-4'
            : 'table-td-y-1'
        }`}
      >
        <thead>
          {getHeaderGroups().map((headerGroup) => (
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
          {getRowModel().rows.map((row) => (
            <RowItem key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollectionViewerTable;
