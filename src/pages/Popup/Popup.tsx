import React, { useEffect, useRef } from 'react';
import Browser from 'webextension-polyfill';
import CollectionButton from './components/CollectionButton';
import {
  ICollectionSummary,
  IOrdering,
  ISetting,
  SortElement,
} from '../../common/interface';
import {
  Collection,
  Collections,
  Setting,
  Storage,
} from '../../common/storage';
import Common from '@/common/common';
import _ from 'lodash';
import { useSortCollections } from '@/common/hooks/useSortCollections';
import { useDarkMode } from '@/common/hooks/useDarkMode';
import log from 'loglevel';
import useSettingStore from '@/common/store/useSettingStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LayoutGridIcon, PlusIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Popup() {
  const { setting } = useSettingStore();

  const [text, setText] = React.useState<string>('');

  const [collections, setCollections] = React.useState<ICollectionSummary[]>(
    [] as ICollectionSummary[]
  );

  const [searchKeyword, setSearchKeyword] = React.useState<string>('');

  const [newCollectionButton, setNewCollectionButton] = React.useState<boolean>(
    false
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const getCollectionsSummary = async () => {
    let _collections = (await Collections.fetchSummary()) as ICollectionSummary[];
    setCollections(_collections);
  };

  const [darkMode, setDarkMode] = useDarkMode();

  const sortedCollections = useSortCollections(
    collections,
    setting!.collectionsOrdering || {},
    searchKeyword
  );

  useEffect(() => {
    getCollectionsSummary().catch(log.error);
  }, []);

  useEffect(() => {
    if (searchKeyword.length == 0) {
      setNewCollectionButton(false);
      return;
    }

    let sameName = _.filter(
      sortedCollections,
      (o) => o.name.toLowerCase() == searchKeyword.toLowerCase()
    );

    if (sameName.length == 0) {
      setNewCollectionButton(true);
    } else {
      setNewCollectionButton(false);
    }
  }, [sortedCollections]);

  useEffect(() => {
    let debugMode = setting?.debugMode ?? false;
    Common.setLogLevel(debugMode);
  }, [setting?.debugMode]);

  const saveTextToCollection = async (name: string) => {
    if (text == '') {
      return;
    }

    let url = await Common.getCurrentTab();

    let result = await Collection.add(name, text, 'text', url);

    if (result) {
      window.close();
    }
  };

  const openTab = () => {
    Browser.tabs.create({
      url: '/panel.html',
    });

    window.close();
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let value = event.target.value;

    setText(value);
  };

  const searchCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    setSearchKeyword(value);
  };

  const toggleDarkMode = async () => {
    let _darkMode = darkMode ? false : true;

    setDarkMode(_darkMode);
  };

  const newCollectionAndSave = async () => {
    let result = await Collection.createAndAdd(searchKeyword, text, 'text');

    if (result) {
      window.close();
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-center p-1 bg-blue-500 text-white">
        <Button variant="ghost" size="icon" onClick={openTab}>
          <LayoutGridIcon className="size-5" />
        </Button>

        <span className="font-bold">Addy</span>

        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? (
            <SunIcon className="size-5" />
          ) : (
            <MoonIcon className="size-5" />
          )}
        </Button>
      </div>

      <div className="m-1 grid gap-2 flex-col">
        <Textarea
          placeholder="Content"
          id="content"
          value={text}
          onChange={handleContentChange}
        />

        <Input
          id="search"
          placeholder="Search or Add Collection"
          type="text"
          onChange={searchCollection}
          ref={inputRef}
        />

        {collections.length == 0 && searchKeyword == '' ? (
          <div className="p-2 text-black text-sm dark:text-white dark:border-slate-400 dark:bg-gray-900">
            <p>Collections not found !</p>
            <p>Use the input box above to add to a new collection</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-0.5">
          {sortedCollections.map((collection, index) => {
            return (
              <CollectionButton
                key={index}
                collection={collection}
                onClick={() => saveTextToCollection(collection.id)}
              />
            );
          })}
        </div>

        {newCollectionButton ? (
          <Button className="w-full py-8" onClick={newCollectionAndSave}>
            <PlusIcon />
            <span>Add into New Collection</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default Popup;
