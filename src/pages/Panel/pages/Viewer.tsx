import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ICollection,
  ICollectionItem,
  IViewingOption,
} from '@/common/interface';
import { Collection, CollectionItem, Setting, Storage } from '@/common/storage';
import CollectionViewerTable from '@Panel/components/CollectionViewerTable';
import _ from 'lodash';
import CollectionImageViewer from '@Panel/components/CollectionViewerImage';
import {
  Link,
  LoaderFunctionArgs,
  Navigate,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  PencilIcon,
  DocumentMinusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import useCollectionsListStore from '@/common/hooks/useCollectionsListStore';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import log from 'loglevel';
import useSettingStore from '@/common/store/useSettingStore';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '../layouts/Header';
import TypeSelector from '../components/viewer/TypeSelector';

export async function loader({ params }: LoaderFunctionArgs<any>) {
  var result = await useCollectionStore
    .getState()
    .fetchCollection(params.collectionId!);

  return result;
}

function Viewer() {
  const loaderData = useCollectionStore((state) => state.collection);

  const navigate = useNavigate();

  const [editCollectionName, setEditCollectionName] = React.useState(false);

  const [collectionName, setCollectionName] = React.useState('');

  let fetchCollectionsList = useCollectionsListStore(
    (state) => state.fetchList
  );

  let collection = useCollectionStore((state) => state.collection);

  let setCollection = useCollectionStore((state) => state.setCollection);

  let removeAllItems = useCollectionStore((state) => state.removeAllItems);

  let changeCollectionColor = useCollectionStore(
    (state) => state.changeCollectionColor
  );

  useEffect(() => {
    setCollectionName(loaderData.name);
  }, [loaderData]);

  const removeCollection = async () => {
    log.debug('removeCollection');

    await Collection.delete(collection.id);

    fetchCollectionsList();

    navigate('/');
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
    fetchCollectionsList();
  };

  return (
    <SidebarInset>
      <Header title="Addy" />
      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="bg-muted/50 mx-auto h-full w-full max-w-5xl rounded-xl p-8">
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
                  removeAllItems(collection.id);
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
              onClick={() => changeCollectionColor(collection.id, 0)}
            ></div>
            <div
              className={`${
                collection.color == 1 ? 'active-color' : ''
              } rounded-full my-auto h-6 w-6 cursor-pointer color-1`}
              onClick={() => changeCollectionColor(collection.id, 1)}
            ></div>
            <div
              className={`${
                collection.color == 2 ? 'active-color' : ''
              } rounded-full my-auto h-6 w-6 cursor-pointer color-2`}
              onClick={() => changeCollectionColor(collection.id, 2)}
            ></div>
            <div
              className={`${
                collection.color == 3 ? 'active-color' : ''
              } rounded-full my-auto h-6 w-6 cursor-pointer color-3`}
              onClick={() => changeCollectionColor(collection.id, 3)}
            ></div>
            <div
              className={`${
                collection.color == 4 ? 'active-color' : ''
              } rounded-full my-auto h-6 w-6 cursor-pointer color-4`}
              onClick={() => changeCollectionColor(collection.id, 4)}
            ></div>
            <div
              className={`${
                collection.color == 5 ? 'active-color' : ''
              } rounded-full my-auto h-6 w-6 cursor-pointer color-5`}
              onClick={() => changeCollectionColor(collection.id, 5)}
            ></div>
            <div
              className={`${
                collection.color == 6 ? 'active-color' : ''
              } rounded-full my-auto h-6 w-6 cursor-pointer color-6`}
              onClick={() => changeCollectionColor(collection.id, 6)}
            ></div>
          </div>

          <TypeSelector />

          <div className="py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}

export default Viewer;
