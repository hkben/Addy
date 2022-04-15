import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ICollection,
  ICollectionItem,
  IViewingOption,
} from '../../../common/interface';
import {
  Collection,
  CollectionItem,
  Setting,
  Storage,
} from '../../../common/storage';
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
    bookmark: 0,
  });

  const [viewingOption, setViewingOption] = React.useState<IViewingOption>(
    {} as IViewingOption
  );

  useEffect(() => {
    const getViewingOption = async () => {
      let _viewingOption = await Setting.fetchViewingOption();
      setViewingOption(_viewingOption);
    };

    getViewingOption().catch(console.error);
  }, []);

  const data = React.useMemo(() => {
    if (collection.items == null) {
      return [];
    }

    setItemCount({
      all: collection.items.length,
      text: collection.items.filter((o) => o.type == 'text').length || 0,
      image: collection.items.filter((o) => o.type == 'image').length || 0,
      bookmark:
        collection.items.filter((o) => o.type == 'bookmark').length || 0,
    });

    if (collectionType == 1) {
      return collection.items.filter((o) => o.type == 'text') || [];
    }

    if (collectionType == 2) {
      return collection.items.filter((o) => o.type == 'image') || [];
    }

    if (collectionType == 3) {
      return collection.items.filter((o) => o.type == 'bookmark') || [];
    }

    return collection.items || [];
  }, [collection, collectionType]);

  const removeCollectionItem = async (_itemId: string) => {
    let result = await CollectionItem.delete(props.collection, _itemId);

    if (result) {
      setCollection((prevState) => ({
        ...prevState,
        //_.remove return new array of removed elements
        items: _.remove(prevState.items, (o) => o.id != _itemId),
      }));
    }
  };

  useEffect(() => {
    const getCollection = async () => {
      let collection = await Collection.fetch(props.collection);

      console.log(props.collection);

      console.log(collection);

      if (typeof collection == 'undefined') {
        return;
      }

      setCollection(collection);
      setCollectionName(collection.name);
      setCollectionType(0);
    };

    const collection = getCollection().catch(console.error);
  }, [props.collection]);

  const removeAllItems = async () => {
    console.log('removeAllItems');

    let result = await Collection.deleteAllItems(collection.id);

    if (result) {
      setCollection((prevState) => ({
        ...prevState,
        items: [],
      }));
    }
  };

  const removeCollection = async () => {
    console.log('removeCollection');

    await Collection.delete(collection.id);

    await props.callback();
  };

  const handleCollectionNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.value;
    setCollectionName(value);
  };

  const handleCollectionNameSubmbit = async () => {
    await Collection.updateName(props.collection, collectionName);
    setEditCollectionName(false);
    await props.callback();
  };

  const changeType = (_type: number) => {
    setCollectionType(_type);
  };

  const handleColorClick = async (_color: number) => {
    let result = await Collection.updateColor(props.collection, _color);

    if (result) {
      await props.callback();
      setCollection({
        ...collection,
        color: _color,
      });
    }
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
          title="Edit Name"
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
          title="Empty Collection"
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
          title="Delete Collection"
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

        <div
          className={`${
            collection.color == 0 || collection.color == null
              ? ''
              : 'border-dotted '
          } rounded-full my-auto h-6 w-6 cursor-pointer bg-transparent border-2 border-gray-700 dark:border-white`}
          onClick={() => handleColorClick(0)}
        ></div>
        <div
          className={`${
            collection.color == 1 ? 'active-color' : ''
          } rounded-full my-auto h-6 w-6 cursor-pointer color-1`}
          onClick={() => handleColorClick(1)}
        ></div>
        <div
          className={`${
            collection.color == 2 ? 'active-color' : ''
          } rounded-full my-auto h-6 w-6 cursor-pointer color-2`}
          onClick={() => handleColorClick(2)}
        ></div>
        <div
          className={`${
            collection.color == 3 ? 'active-color' : ''
          } rounded-full my-auto h-6 w-6 cursor-pointer color-3`}
          onClick={() => handleColorClick(3)}
        ></div>
        <div
          className={`${
            collection.color == 4 ? 'active-color' : ''
          } rounded-full my-auto h-6 w-6 cursor-pointer color-4`}
          onClick={() => handleColorClick(4)}
        ></div>
        <div
          className={`${
            collection.color == 5 ? 'active-color' : ''
          } rounded-full my-auto h-6 w-6 cursor-pointer color-5`}
          onClick={() => handleColorClick(5)}
        ></div>
        <div
          className={`${
            collection.color == 6 ? 'active-color' : ''
          } rounded-full my-auto h-6 w-6 cursor-pointer color-6`}
          onClick={() => handleColorClick(6)}
        ></div>
      </div>

      <div className="w-2/3 items-center text-xs rounded-md">
        <button
          className={`${
            collectionType == 0
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/4 px-5 py-3 font-medium border rounded-l-lg border-gray-300`}
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
          } w-1/4 px-5 py-3 font-medium border-y border-r border-gray-300`}
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
          } w-1/4 px-5 py-3 font-medium border-y border-r border-gray-300`}
          type="button"
          onClick={() => changeType(2)}
        >
          Image ({itemCount.image})
        </button>

        <button
          className={`${
            collectionType == 3
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/4 px-5 py-3 font-medium border-r border-y rounded-r-lg border-gray-300`}
          type="button"
          onClick={() => changeType(3)}
        >
          Bookmark ({itemCount.bookmark})
        </button>
      </div>

      <div className="py-8">
        {collectionType == 2 ? (
          <CollectionImageViewer
            data={data}
            onDeleteItem={removeCollectionItem}
            collectionName={collection.name}
            imageColumns={viewingOption.imageColumns}
          />
        ) : (
          <CollectionViewerTable
            data={data}
            onDeleteItem={removeCollectionItem}
            hiddenColumns={viewingOption.hiddenColumns}
            spacingProp={viewingOption.spacing}
          />
        )}
      </div>
    </div>
  );
}

export default CollectionViewer;
