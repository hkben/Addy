import React, { useCallback, useEffect, useMemo } from 'react';
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
import useCollectionStore from '@/common/hooks/useCollectionStore';
import log from 'loglevel';
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
  let collection = useCollectionStore((state) => state.collection);

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
