import React, { useCallback, useEffect, useMemo } from 'react';
import { ICollection, ICollectionItem } from '../../interface';
import Storage from '../../storage';
import { Column, useSortBy, useTable } from 'react-table';
import CollectionViewerTable from './CollectionViewerTable';
import _ from 'lodash';

interface Prop {
  collection: string;
  callback: Promise<void>;
}

function CollectionViewer(props: Prop) {
  const [collection, setCollection] = React.useState<ICollection>(
    {} as ICollection
  );

  const data = React.useMemo(() => collection.items || [], [collection]);

  const removeCollectionItem = useCallback(
    async (_itemId: string) => {
      let result = await Storage.removeCollectionItem(
        props.collection,
        _itemId
      );

      if (result) {
        let newCollecionArray = _.remove(
          collection.items,
          (o) => o.id == _itemId
        );

        collection.items = newCollecionArray;

        setCollection(collection);
      }
    },
    [props.collection]
  );

  useEffect(() => {
    const getCollection = async () => {
      let collection = await Storage.getCollection(props.collection);

      console.log(props.collection);

      console.log(collection);

      if (typeof collection == 'undefined') {
        return;
      }

      setCollection(collection);
    };

    const collection = getCollection().catch(console.error);
  }, [props.collection]);

  const removeAllItems = async () => {
    console.log('removeAllItems');

    await Storage.removeAllItems(collection.id);

    await props.callback;
  };

  const removeCollection = async () => {
    console.log('removeCollection');

    await Storage.removeCollection(collection.id);

    await props.callback;
  };

  return (
    <div>
      <div className="w-full py-5 flex gap-2.5">
        <p className="text-3xl">{collection.name}</p>

        {/* <button className="p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center">
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button> */}

        <button
          className="p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
          onClick={() => {
            const confirmBox = window.confirm(
              'Do you really want to delete all items in this collection?'
            );
            if (confirmBox === true) {
              removeAllItems();
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
              d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>

        <button
          className="p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
          onClick={() => {
            const confirmBox = window.confirm(
              'Do you really want to delete this collection?'
            );
            if (confirmBox === true) {
              removeCollection();
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
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="py-8">
        <CollectionViewerTable
          data={data}
          onDeleteItem={removeCollectionItem}
        />
      </div>
    </div>
  );
}

export default CollectionViewer;
