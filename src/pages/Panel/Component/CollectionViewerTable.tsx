import React, { useEffect, useMemo } from 'react';
import { ICollectionItem, IViewingOption } from '../../../common/interface';
import { Column, useSortBy, useTable } from 'react-table';
import moment from 'moment';
import { Setting } from '../../../common/storage';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import TableEditableCell from './TableEditableCell';

interface Prop {
  data: Array<ICollectionItem>;
  onDeleteItem: (_itemId: string) => Promise<void>;
  hiddenColumns: string[];
  spacingProp: string;
  onEditItem: (_itemId: string, _content: string) => Promise<void>;
}

function CollectionViewerTable({
  data,
  onDeleteItem,
  hiddenColumns,
  spacingProp,
  onEditItem,
}: Prop) {
  const [spacing, setSpacing] = React.useState<string>('normal');

  const handleSpacingSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;
    setSpacing(value);

    Setting.updateViewingSpacing(value);
  };

  const columns: Array<Column<ICollectionItem>> = useMemo(
    () => [
      {
        Header: 'Content',
        accessor: (row) => {
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

            return <p data-tip={row.content}>{text}</p>;
          }

          return row.content;
        },
      },
      {
        Header: 'Type',
        className: 'text-center',
        accessor: (row) => row.type,
      },
      {
        Header: 'Created Time',
        className: 'text-center',
        accessor: (row) => moment(row.createTime).format('YYYY-MM-DD hh:mm A'),
      },
      {
        Header: 'Last Modified',
        className: 'text-center',
        accessor: (row) => moment(row.modifyTime).format('YYYY-MM-DD hh:mm A'),
      },
      {
        Header: 'Source',
        className: 'text-center',
        accessor: (row) => (
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
        Header: 'Delete',
        className: 'text-center',
        accessor: (row) => (
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

  const defaultColumn = {
    Cell: ({ value, row, column }: any) => (
      <TableEditableCell
        value={value}
        row={row}
        column={column}
        onEditItem={onEditItem}
      />
    ),
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    visibleColumns,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: { hiddenColumns: hiddenColumns || [] },
      autoResetSortBy: false,
      defaultColumn,
    },
    useSortBy
  );

  const handleHiddenToggle = (_columnId: string) => {
    //this state.hiddenColumns is memoized, so using xor to get updated hiddenColumns
    let _hiddenColumns = state.hiddenColumns || [];
    let newHiddenColumns = _.xor(_hiddenColumns, [_columnId]);
    Setting.updateViewingHiddenColumns(newHiddenColumns);
  };

  useEffect(() => {
    setSpacing(spacingProp);
  }, [spacingProp]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="">
      <div className="w-full">
        <div className="w-4/6 inline-block">
          {allColumns.map((column) => (
            <div key={column.id} className="inline-block text-base p-2">
              <input
                type="checkbox"
                className="w-4 h-4 border border-gray-200 rounded-md"
                {...column.getToggleHiddenProps()}
                //this onChange overwrite the onChange prop from getToggleHiddenProps()
                onChange={(e) => {
                  column.toggleHidden(!e.target.checked);
                  handleHiddenToggle(column.id);
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

      <ReactTooltip
        effect="solid"
        place="top"
        getContent={(dataTip) => <img className="max-h-80" src={dataTip} />}
      />

      <table
        {...getTableProps()}
        className="table-auto min-w-full text-base divide-y-2 divide-gray-200 dark:divide-gray-500"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="py-4 text-lg"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 inline mx-2"
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
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 inline mx-2"
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
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="divide-y divide-gray-200 dark:divide-gray-500"
        >
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={`whitespace-pre-line px-2 ${
                        spacing == 'normal' ? 'py-4' : 'py-1'
                      }`}
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                        },
                      ])}
                    >
                      {cell.render('Cell')}
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
