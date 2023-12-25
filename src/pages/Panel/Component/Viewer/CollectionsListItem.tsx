import React from 'react';
import { useDrop } from 'react-dnd';
import {
  ICollectionItem,
  ICollectionSummary,
} from '../../../../common/interface';
import { Row } from '@tanstack/react-table';
import { Link, useParams } from 'react-router-dom';
import CollectionItem from '../../../../common/storage/collectionItem';
import useCollectionsListStore from '../../../../common/hook/useCollectionsListStore';
import { stat } from 'fs';

interface Prop {
  collection: ICollectionSummary;
}

interface DropItem {
  id: string;
}

function CollectionsListItem({ collection }: Prop) {
  let { collectionId: sourceCollectionId } = useParams();

  let fetchCollectionsList = useCollectionsListStore(
    (state) => state.fetchList
  );

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'row',
    drop: async (item: Row<DropItem>) => {
      if (sourceCollectionId == null) {
        return;
      }

      await CollectionItem.move(sourceCollectionId, item.id, collection.id);

      fetchCollectionsList();

      //TODO delete item from source collection state
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <li
      className={`py-1 px-2 cursor-pointer rounded ${
        isActive ? 'bg-slate-200 dark:bg-slate-600' : ''
      }`}
      ref={dropRef}
    >
      <Link to={`/${collection.id}`}>
        <p>
          {collection.name}
          <span className="text-sm"> ({collection.items})</span>
          {collection.color != null && collection.color != 0 ? (
            <span
              className={`mx-1 rounded-full inline-block h-3 w-3 color-${collection.color}`}
            ></span>
          ) : (
            ''
          )}
        </p>
      </Link>
    </li>
  );
}

export default CollectionsListItem;
