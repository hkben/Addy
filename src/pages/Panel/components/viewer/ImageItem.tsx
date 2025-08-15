import React from 'react';
import { useDrag } from 'react-dnd';
import { ICollectionItem } from '@/common/interface';
import { useParams } from 'react-router-dom';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import useSettingStore from '@/common/store/useSettingStore';
import {
  LinkIcon,
  MenuIcon,
  MoreHorizontal,
  ScanSearchIcon,
  Trash2Icon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Prop {
  item: ICollectionItem;
}

function ImageItem({ item }: Prop) {
  let { collectionId } = useParams();

  const { setting } = useSettingStore();

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
    if (setting!.viewingOption?.imageSearchEngine == 1) {
      return `https://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:${item.content}`;
    }

    //Yandex
    if (setting!.viewingOption?.imageSearchEngine == 2) {
      return `https://yandex.com/images/search?source=collections&rpt=imageview&url=${item.content}`;
    }

    //TinEye
    if (setting!.viewingOption?.imageSearchEngine == 3) {
      return `https://www.tineye.com/search/?url=${item.content}`;
    }

    //Google
    return `https://lens.google.com/uploadbyurl?url=${item.content}`;
  };

  return (
    <div
      key={item.id}
      className={`rounded-md border grid overflow-hidden
      ${isDragging ? 'opacity-50' : ''}
      `}
      ref={previewRef}
    >
      <div className="w-full h-10 flex justify-between items-center text-base font-bold">
        <div ref={dragRef} className="w-10 cursor-pointer select-none px-2">
          <MenuIcon className="size-5" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[150px]" align="end">
            {/* <DropdownMenuItem
                 className="cursor-pointer"
                 >
                  <FileCodeIcon />
                  <span>Edit</span>
                </DropdownMenuItem> */}
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a href={item.source} target="_blank" rel="noopener noreferrer">
                <LinkIcon />
                <span>View Source</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <a
                href={imageSearchURL()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ScanSearchIcon />
                <span>Image Search</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                const confirmBox = window.confirm(
                  'Do you really want to delete this item?'
                );
                if (confirmBox === true && collectionId != null) {
                  removeCollectionItem(collectionId, item.id);
                }
              }}
            >
              <Trash2Icon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <img
        className="mx-auto overflow-hidden"
        src={item.content}
        loading="lazy"
        alt={item.id}
      />
    </div>
  );
}

export default ImageItem;
