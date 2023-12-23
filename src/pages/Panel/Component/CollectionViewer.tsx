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
import CollectionViewerTable from './CollectionViewerTable';
import _ from 'lodash';
import CollectionImageViewer from './CollectionViewerImage';
import useViewingOptionStore from '../../../common/hook/useViewingOptionStore';
import { LoaderFunctionArgs, useLoaderData, useParams } from 'react-router-dom';
import {
  PencilIcon,
  DocumentMinusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Prop {
  callback: () => Promise<void>;
}

export async function loader({ params }: LoaderFunctionArgs<any>) {
  let collection = await Collection.fetch(params.collectionId!);

  console.log(`Loading ${params.collectionId}`);

  console.log(`Name:${collection.name} Items:${collection.items.length}`);
  return collection;
}

function CollectionViewer(props: Prop) {
  const loaderData = useLoaderData() as ICollection;

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

  const fetchViewingOption = useViewingOptionStore(
    (state) => state.fetchViewingOption
  );

  const viewingOption = useViewingOptionStore((state) => state.viewingOption);

  useEffect(() => {
    fetchViewingOption();
  }, [fetchViewingOption]);

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
    let result = await CollectionItem.delete(collection.id, _itemId);

    if (result) {
      setCollection((prevState) => ({
        ...prevState,
        //_.remove return new array of removed elements
        items: _.remove(prevState.items, (o) => o.id != _itemId),
      }));

      await props.callback();
    }
  };

  const editCollectionItem = async (_itemId: string, _content: string) => {
    let { result, datetime } = await CollectionItem.updateContent(
      collection.id,
      _itemId,
      _content
    );

    //update content in Collection
    let updateCollection = (_items: Array<ICollectionItem>) => {
      let itemIndex = _.findIndex(_items, (o) => o.id == _itemId)!;
      _items[itemIndex].content = _content;
      _items[itemIndex].modifyTime = datetime;
      return _items;
    };

    if (result) {
      setCollection((prevState) => ({
        ...prevState,
        items: updateCollection(prevState.items),
      }));

      await props.callback();
    }
  };

  useEffect(() => {
    //update only after viewingOption is loaded
    if (viewingOption == null) {
      return;
    }

    setCollection(loaderData);
    setCollectionName(loaderData.name);
    setCollectionType(0);
  }, [loaderData, viewingOption]);

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
    await Collection.updateName(collection.id, collectionName);
    setEditCollectionName(false);
    await props.callback();
  };

  const changeType = (_type: number) => {
    setCollectionType(_type);
  };

  const handleColorClick = async (_color: number) => {
    let result = await Collection.updateColor(collection.id, _color);

    if (result) {
      await props.callback();
      setCollection({
        ...collection,
        color: _color,
      });
    }
  };

  let viewer = useMemo(() => {
    return (
      <CollectionViewerTable
        data={data}
        onDeleteItem={removeCollectionItem}
        onEditItem={editCollectionItem}
      />
    );
  }, [data]);

  let imageViewer = useMemo(() => {
    return (
      <CollectionImageViewer
        data={data}
        onDeleteItem={removeCollectionItem}
        collectionName={collection.name}
      />
    );
  }, [data]);

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
          <PencilIcon className="h-6 w-6 m-auto" strokeWidth={2} />
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
          <DocumentMinusIcon className="h-6 w-6 m-auto" strokeWidth={2} />
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
          <TrashIcon className="h-6 w-6 m-auto" strokeWidth={2} />
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
          } w-1/4 px-5 py-3 font-semibold border rounded-l-lg border-gray-300`}
          type="button"
          onClick={() => changeType(0)}
        >
          📕 All ({itemCount.all})
        </button>

        <button
          className={`${
            collectionType == 1
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/4 px-5 py-3 font-semibold border-y border-r border-gray-300`}
          type="button"
          onClick={() => changeType(1)}
        >
          📝 Text ({itemCount.text})
        </button>

        <button
          className={`${
            collectionType == 2
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/4 px-5 py-3 font-semibold border-y border-r border-gray-300`}
          type="button"
          onClick={() => changeType(2)}
        >
          🖼️ Image ({itemCount.image})
        </button>

        <button
          className={`${
            collectionType == 3
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } w-1/4 px-5 py-3 font-semibold border-r border-y rounded-r-lg border-gray-300`}
          type="button"
          onClick={() => changeType(3)}
        >
          🔖 Bookmark ({itemCount.bookmark})
        </button>
      </div>

      <div className="py-8">{collectionType == 2 ? imageViewer : viewer}</div>
    </div>
  );
}

export default CollectionViewer;
