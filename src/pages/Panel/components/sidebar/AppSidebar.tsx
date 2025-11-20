import {
  ArrowDownAZIcon,
  ArrowUpAZIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import React, { useEffect, useRef } from 'react';
import useCollectionsListStore from '@/common/hooks/useCollectionsListStore';
import { useSortCollections } from '@/common/hooks/useSortCollections';
import { IOrdering } from '@/common/interface';
import { Collection } from '@/common/storage';
import useSettingStore from '@/common/store/useSettingStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import CollectionsListItem from '../../components/viewer/CollectionsListItem';
import { useSyncStore } from '@/common/store/useSyncStore';
import log from 'loglevel';

export function AppSidebar() {
  const { setting } = useSettingStore();

  const collections = useCollectionsListStore((state) => state.summary);

  const fetchCollectionsList = useCollectionsListStore(
    (state) => state.fetchList
  );

  let needRefresh = useSyncStore((state) => state.needRefresh);

  let resetRefreshFlag = useSyncStore((state) => state.resetRefreshFlag);

  const [ordering, setOrdering] = React.useState<IOrdering>(
    () => setting?.collectionsOrdering || ({} as IOrdering)
  );

  const [searchKeyword, setSearchKeyword] = React.useState<string>('');

  const sortedCollections = useSortCollections(
    collections,
    ordering,
    searchKeyword
  );

  useEffect(() => {
    // Run on first render and whenever needRefresh changes
    if (collections.length === 0 || needRefresh) {
      log.debug('Reload collections list');

      // Initial load
      fetchCollectionsList();

      if (needRefresh) {
        resetRefreshFlag();
      }
    }
  }, [collections.length, fetchCollectionsList, needRefresh, resetRefreshFlag]);

  const newCollectionSubmit = async () => {
    if (searchKeyword === '') {
      return;
    }

    await Collection.create(searchKeyword);
    setSearchKeyword('');

    fetchCollectionsList();
  };

  const handleOrderingSelection = async (_value: string) => {
    let value = parseInt(_value);

    setOrdering((prevState) => ({
      ...prevState,
      type: value,
    }));
  };

  const handleDescendingOption = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    let value = ordering.descending ? false : true;

    setOrdering((prevState) => ({
      ...prevState,
      descending: value,
    }));
  };

  const searchCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    setSearchKeyword(value);
  };

  const renderNewCollectionButton = () => {
    if (searchKeyword === '') {
      return null;
    }

    return (
      <SidebarGroup className="py-0">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button className="w-full py-8" onClick={newCollectionSubmit}>
                <PlusIcon />
                <span>New Collection</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  const renderNoCollections = () => {
    if (collections.length > 0) {
      return null;
    }

    return (
      <SidebarGroup className="py-0">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="text-sm text-muted-foreground">
              <p>No Collections found!</p>
              <p>
                Type a name in the "Search or Create" input above to create a
                new collection.
              </p>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent className="flex items-center justify-between">
            {/* <SidebarGroupLabel>Collections</SidebarGroupLabel> */}
            <Select
              defaultValue={ordering ? ordering.type.toString() : '0'}
              onValueChange={handleOrderingSelection}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Default</SelectItem>
                <SelectItem value="1">Alphabetic</SelectItem>
                <SelectItem value="2">Created Time</SelectItem>
                <SelectItem value="3">Last Modify Time</SelectItem>
                <SelectItem value="4">Items Count</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={handleDescendingOption}>
              {ordering.descending ? <ArrowUpAZIcon /> : <ArrowDownAZIcon />}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">
            <div className="relative w-full max-w-sm">
              <SidebarInput
                id="search"
                placeholder="Search or Create..."
                className="pl-8 h-10"
                value={searchKeyword}
                onChange={searchCollection}
                autoComplete="off"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                onClick={() => {
                  setSearchKeyword('');
                }}
              >
                <XIcon />
              </Button>
            </div>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </SidebarGroupContent>
        </SidebarGroup>

        {renderNewCollectionButton()}
      </SidebarHeader>

      <SidebarContent className="mb-4">
        <SidebarGroup>
          <SidebarGroupLabel>
            Collections ({sortedCollections.length})
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sortedCollections.map((collection) => (
                <CollectionsListItem
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </SidebarMenu>

            {renderNoCollections()}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
