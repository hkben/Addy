import React, { useMemo } from 'react';
import { ICollectionItem } from '../../interface';
import { Column, useSortBy, useTable } from 'react-table';
import moment from 'moment';

interface Prop {
  data: Array<ICollectionItem>;
}

function CollectionViewerTable({ data }: Prop) {
  const [spacing, setSpacing] = React.useState<string>('normal');

  const handleSpacingSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;
    setSpacing(value);
  };

  const columns: Array<Column<ICollectionItem>> = useMemo(
    () => [
      {
        Header: 'Content',
        accessor: (row) => row.text,
      },
      {
        Header: 'Created Time',
        className: 'text-center',
        accessor: (row) => moment(row.createTime).format('YYYY-MM-DD hh:mm A'),
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
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div className="">
      <div className="flex">
        {allColumns.map((column) => (
          <div key={column.id} className="inline text-base p-4">
            <input
              type="checkbox"
              className="w-4 h-4 border border-gray-200 rounded-md"
              {...column.getToggleHiddenProps()}
            />
            <span className="ml-3 font-medium">{column.id}</span>
          </div>
        ))}

        <div className="inline text-base ml-auto my-auto">
          <label className="px-4" htmlFor="spaceing">
            Spacing
          </label>

          <select
            className="h-10 px-4 pr-10 border-solid border-2 border-grey-600 rounded-lg "
            id="spaceing"
            value={spacing}
            onChange={handleSpacingSelection}
          >
            <option value="normal">Normal</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>

      <table
        {...getTableProps()}
        className="table-auto min-w-full text-base divide-y-2 divide-gray-200"
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
        <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr className="hover:bg-gray-200" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={`px-2 ${
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