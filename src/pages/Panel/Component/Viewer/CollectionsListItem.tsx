import React from 'react';
import { useDrop } from 'react-dnd';
import {
  ICollectionItem,
  ICollectionSummary,
} from '../../../../common/interface';
import { Row } from '@tanstack/react-table';
import { Link, useParams } from 'react-router-dom';

interface Prop {
  collection: ICollectionSummary;
}

function CollectionsListItem({ collection }: Prop) {
  let { collectionId: sourceCollectionId } = useParams();

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow: Row<ICollectionItem>) => {
      console.log(draggedRow);
      console.log(collection.id);
      console.log(sourceCollectionId);
      //TODO move item
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
