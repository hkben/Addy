import React from 'react';
import { useDrag } from 'react-dnd';
import { ICollectionItem } from '../../../../common/interface';
import {
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import moment from 'moment';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useParams } from 'react-router-dom';
import useCollectionStore from '../../../../common/hook/useCollectionStore';
import useViewingOptionStore from '../../../../common/hook/useViewingOptionStore';

interface Prop {
  item: ICollectionItem;
}

function ImageItem({ item }: Prop) {
  let { collectionId } = useParams();

  const { viewingOption } = useViewingOptionStore();

  let removeCollectionItem = useCollectionStore(
    (state) => state.removeCollectionItem
  );

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    type: 'row',
    item: () => {
      return {
        id: item.id,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const imageSearchURL = () => {
    //Bing
    if (viewingOption?.imageSearchEngine == 1) {
      return `https://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:${item.content}`;
    }

    //Yandex
    if (viewingOption?.imageSearchEngine == 2) {
      return `https://yandex.com/images/search?source=collections&rpt=imageview&url=${item.content}`;
    }

    //TinEye
    if (viewingOption?.imageSearchEngine == 3) {
      return `https://www.tineye.com/search/?url=${item.content}`;
    }

    //Google
    return `https://lens.google.com/uploadbyurl?url=${item.content}`;
  };

  return (
    <div
      key={item.id}
      className={`flex flex-col p-2 bg-gray-200 dark:bg-gray-700 rounded-md box-content
      ${isDragging ? 'opacity-50' : ''}
      `}
      ref={previewRef}
    >
      <div className="flex py-2 justify-start text-base font-bold">
        <span ref={dragRef} className="cursor-pointer">
          <Bars3Icon className="w-6 h-6" strokeWidth={2} />
        </span>

        <span>{moment(item.createTime).format('YYYY-MM-DD hh:mm A')}</span>
        <span className="flex ml-auto">
          <a
            className="inline-block align-middle m-auto"
            href={imageSearchURL()}
            target="_blank"
            rel="noreferrer"
          >
            <MagnifyingGlassIcon className="w-6 h-6" strokeWidth={2} />
          </a>
          <a
            className="inline-block align-middle m-auto"
            href={item.source}
            target="_blank"
            rel="noreferrer"
          >
            <ArrowTopRightOnSquareIcon className="w-6 h-6" strokeWidth={2} />
          </a>

          <button
            className="inline-block align-middle m-auto"
            onClick={() => {
              const confirmBox = window.confirm(
                'Do you really want to delete this item?'
              );
              if (confirmBox === true && collectionId != null) {
                removeCollectionItem(collectionId, item.id);
              }
            }}
          >
            <XCircleIcon className="w-6 h-6" strokeWidth={2} />
          </button>
        </span>
      </div>
      <div className="h-full flex items-center">
        <img
          className="self-center"
          src={item.content}
          loading="lazy"
          alt={item.id}
        />
      </div>
    </div>
  );
}

export default ImageItem;
