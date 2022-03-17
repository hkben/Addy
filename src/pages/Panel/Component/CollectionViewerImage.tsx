import React, { useEffect, useMemo } from 'react';
import { ICollectionItem } from '../../interface';
import { Column, useSortBy, useTable } from 'react-table';
import moment from 'moment';

interface Prop {
  data: Array<ICollectionItem>;
  onDeleteItem: (_itemId: string) => Promise<void>;
}

function CollectionViewerImage({ data, onDeleteItem }: Prop) {
  const [columns, setColumns] = React.useState(3);

  const handleColumnsSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;
    setColumns(parseInt(value));
  };

  return (
    <div>
      <div className="flex">
        <div className="inline text-base mr-auto my-auto">
          <label className="px-4" htmlFor="columns">
            Columns
          </label>

          <select
            className="h-10 px-4 pr-10 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="columns"
            value={columns}
            onChange={handleColumnsSelection}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>

      <div className={`py-3 grid gap-2 grid-cols-${columns}`}>
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 bg-gray-200 dark:bg-gray-700 rounded-md box-content"
          >
            <div className="flex py-2 justify-start text-base font-bold">
              {moment(item.createTime).format('YYYY-MM-DD hh:mm A')}
              <span className="ml-auto">
                <a
                  className="inline-block align-middle"
                  href={item.source}
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

                <button
                  className="inline-block align-middle"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      'Do you really want to delete this item?'
                    );
                    if (confirmBox === true) {
                      onDeleteItem(item.id);
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
              </span>
            </div>
            <div className="h-full flex items-center">
              <img className="self-center" src={item.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionViewerImage;
