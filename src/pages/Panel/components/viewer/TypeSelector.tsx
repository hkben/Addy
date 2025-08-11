import useCollectionStore from '@/common/hooks/useCollectionStore';
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

  return (
    <div className="w-2/3 items-center text-xs rounded-md">
      <NavLink
        className={({ isActive }) =>
          `${
            isActive
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } inline-block text-center w-1/4 px-5 py-3 font-semibold border-y border-r border-gray-300 rounded-l-lg`
        }
        type="button"
        to={`/${collectionId}/all`}
      >
        📕 All ({itemCount.all})
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `${
            isActive
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } inline-block text-center w-1/4 px-5 py-3 font-semibold border-y border-r border-gray-300`
        }
        type="button"
        to={`/${collectionId}/text`}
      >
        📝 Text ({itemCount.text})
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `${
            isActive
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } inline-block text-center w-1/4 px-5 py-3 font-semibold border-y border-r border-gray-300`
        }
        type="button"
        to={`/${collectionId}/image`}
      >
        🖼️ Image ({itemCount.image})
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `${
            isActive
              ? 'bg-gray-200 dark:bg-gray-600'
              : 'bg-white dark:bg-gray-800'
          } inline-block text-center w-1/4 px-5 py-3 font-semibold border-r border-y rounded-r-lg border-gray-300`
        }
        type="button"
        to={`/${collectionId}/bookmark`}
      >
        🔖 Bookmark ({itemCount.bookmark})
      </NavLink>
    </div>
  );
}

export default TypeSelector;
