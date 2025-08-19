import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ICollection,
  ICollectionItem,
  IViewingOption,
} from '@/common/interface';
import { Collection, CollectionItem, Setting, Storage } from '@/common/storage';
import _ from 'lodash';
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
import ColorSelector from '../components/viewer/ColorSelector';
import DeleteItemDialog from '../components/viewer/dialog/DeleteItemDialog';
import EditDialog from '../components/viewer/dialog/EditDialog';
import HeaderActions from '../components/viewer/HeaderActions';
import NameUpdatePopover from '../components/viewer/NameUpdatePopover';

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
      <DeleteItemDialog />
      <EditDialog />
      <Header title={collection.name} color={collection.color}>
        <HeaderActions />
      </Header>
      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="bg-muted/50 mx-auto h-full w-full max-w-5xl rounded-xl p-8">
          <div className="w-full py-5 flex gap-2.5">
            <p className="text-3xl my-auto">{collection.name}</p>

            <NameUpdatePopover />

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

            <ColorSelector />
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
