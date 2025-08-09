import React from 'react';
import { useDrop } from 'react-dnd';
import { ICollectionSummary } from '@/common/interface';
import { Row } from '@tanstack/react-table';
import { Link, useParams } from 'react-router-dom';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

interface Prop {
  collection: ICollectionSummary;
}

interface DropItem {
  id: string;
}

function CollectionsListItem({ collection }: Prop) {
  let { collectionId: sourceCollectionId } = useParams();

  let moveCollectionItem = useCollectionStore(
    (state) => state.moveCollectionItem
  );

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: 'row',
    drop: async (item: Row<DropItem>) => {
      if (sourceCollectionId == null) {
        return;
      }

      moveCollectionItem(sourceCollectionId, item.id, collection.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <SidebarMenuItem className="">
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={`/${collection.id}`} ref={dropRef}>
          <span className="text-lg">{collection.name}</span>
          <span className="text-sm"> ({collection.items})</span>
          {collection.color != null && collection.color != 0 ? (
            <span
              className={`mx-1 rounded-full inline-block h-3 w-3 color-${collection.color}`}
            ></span>
          ) : (
            ''
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default CollectionsListItem;
