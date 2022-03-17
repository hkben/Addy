import React, { useCallback, useEffect, useMemo } from 'react';
import { ICollection, ICollectionItem } from '../../interface';
import Storage from '../../storage';
import { Column, useSortBy, useTable } from 'react-table';
import CollectionViewerTable from './CollectionViewerTable';
import _ from 'lodash';
import CollectionImageViewer from './CollectionViewerImage';

interface Prop {
  collection: string;
  callback: () => Promise<void>;
}

function CollectionViewer(props: Prop) {
  const [collection, setCollection] = React.useState<ICollection>(
    {} as ICollection
  );

  const [editCollectionName, setEditCollectionName] = React.useState(false);

  const [collectionName, setCollectionName] = React.useState('');

  const [collectionType, setCollectionType] = React.useState(0);

  const [itemCount, setItemCount] = React.useState({
    all: 0,
    text: 0,
    image: 0,
  });

  const data = React.useMemo(() => {
    if (collectionType == 1) {
      return collection.items.filter((o) => o.type == 'text') || [];
    }

    if (collectionType == 2) {
      return collection.items.filter((o) => o.type == 'image') || [];
    }

    return collection.items || [];
  }, [collection, collectionType]);

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
      setCollectionName(collection.name);

      setItemCount({
        all: collection.items.length,
        text: collection.items.filter((o) => o.type == 'text').length || 0,
        image: collection.items.filter((o) => o.type == 'image').length || 0,
      });
    };

    const collection = getCollection().catch(console.error);
  }, [props.collection]);

  const removeAllItems = async () => {
    console.log('removeAllItems');

    await Storage.removeAllItems(collection.id);

    await props.callback();
  };

  const removeCollection = async () => {
    console.log('removeCollection');

    await Storage.removeCollection(collection.id);

    await props.callback();
  };

  const handleCollectionNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.value;
    setCollectionName(value);
  };

  const handleCollectionNameSubmbit = async () => {
    await Storage.updateCollectionName(props.collection, collectionName);
    setEditCollectionName(false);
    await props.callback();
  };

  const changeType = (_type: number) => {
    setCollectionType(_type);
  };

  return (
    <div>
      <div className="w-full py-5 flex gap-2.5">
        <p className="text-3xl my-auto">
          {editCollectionName ? (
            <input
              className="px-2 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              type="text"
              value={collectionName}
              onChange={handleCollectionNameChange}
            />
          ) : (
            collectionName
          )}
        </p>

        <button
          className="h-10 w-10 p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
          onClick={() => {
            if (editCollectionName == false) {
              setEditCollectionName(true);
            } else {
              handleCollectionNameSubmbit();
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 m-auto"
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
        </button>

        <button
          className="h-10 w-10 p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
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
            className="h-6 w-6 m-auto"
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
          className="h-10 w-10 p-1 px-1.5 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
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
            className="h-6 w-6 m-auto"
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

      <div className="w-2/3 items-center text-xs rounded-md">
        <button
          className={`${
            collectionType == 0
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/3 px-5 py-3 font-medium border rounded-l-lg border-gray-300`}
          type="button"
          onClick={() => changeType(0)}
        >
          All ({itemCount.all})
        </button>

        <button
          className={`${
            collectionType == 1
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/3 px-5 py-3 font-medium border-y border-gray-300`}
          type="button"
          onClick={() => changeType(1)}
        >
          Text ({itemCount.text})
        </button>

        <button
          className={`${
            collectionType == 2
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/3 px-5 py-3 font-medium border rounded-r-lg border-gray-300`}
          type="button"
          onClick={() => changeType(2)}
        >
          Image ({itemCount.image})
        </button>
      </div>

      <div className="py-8">
        {collectionType == 2 ? (
          <CollectionImageViewer
            data={data}
            onDeleteItem={removeCollectionItem}
          />
        ) : (
          <CollectionViewerTable
            data={data}
            onDeleteItem={removeCollectionItem}
          />
        )}
      </div>
    </div>
  );
}

export default CollectionViewer;
