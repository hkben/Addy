import useCollectionStore from '@/common/hooks/useCollectionStore';
import { cn } from '@/lib/utils';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function TypeSelector() {
  const collection = useCollectionStore((state) => state.collection);

  const { collectionId } = useParams();

  const itemCount = {
    all: collection.items.length,
    text: collection.items.filter((item) => item.type === 'text').length,
    image: collection.items.filter((item) => item.type === 'image').length,
    bookmark: collection.items.filter((item) => item.type === 'bookmark')
      .length,
  };

  const className = cn(
    `[.active]:bg-background dark:[.active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-2 rounded-md border border-transparent px-12 py-3 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 [.active]:shadow-sm`
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-muted text-muted-foreground inline-flex w-fit items-center justify-center rounded-lg p-[3px]">
        <NavLink
          className={className}
          type="button"
          to={`/${collectionId}/all`}
        >
          📕
          <span>All ({itemCount.all})</span>
        </NavLink>

        <NavLink
          className={className}
          type="button"
          to={`/${collectionId}/text`}
        >
          📝
          <span>Text ({itemCount.text})</span>
        </NavLink>

        <NavLink
          className={className}
          type="button"
          to={`/${collectionId}/image`}
        >
          🖼️
          <span>Image ({itemCount.image})</span>
        </NavLink>

        <NavLink
          className={className}
          type="button"
          to={`/${collectionId}/bookmark`}
        >
          🔖
          <span>Bookmark ({itemCount.bookmark})</span>
        </NavLink>
      </div>
    </div>
  );
}

export default TypeSelector;
