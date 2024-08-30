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
import Settings from '@Panel/layouts/Settings';
import _ from 'lodash';
import { useSortCollections } from '@/common/hooks/useSortCollections';
import { useDarkMode } from '@/common/hooks/useDarkMode';
import { HomeIcon, MoonIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/outline';
import log from 'loglevel';

function Popup() {
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

  const [ordering, setOrdering] = React.useState<IOrdering>({} as IOrdering);

  const sortedCollections = useSortCollections(
    collections,
    ordering,
    searchKeyword
  );

  useEffect(() => {
    getOrdering().catch(log.error);
    getCollectionsSummary().catch(log.error);
    getDebugMode().catch(log.error);
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

  const getOrdering = async () => {
    let _ordering = await Setting.fetchOrdering();
    setOrdering(_ordering);
  };

  const getDebugMode = async () => {
    let _setting = await Setting.fetch();
    Common.setLogLevel(_setting.debugMode);
  };

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

  const toggleDarkMode = async (event: React.MouseEvent<HTMLDivElement>) => {
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
      <div className="flex justify-between py-2 text-base font-bold text-center bg-blue-500 text-white">
        <div
          className="inline-flex px-2 cursor-pointer hover:text-gray-300"
          onClick={openTab}
        >
          <HomeIcon className="h-6 w-6" strokeWidth={2} />
        </div>
        <div className="inline-flex my-auto">Addy</div>
        <div
          className="inline-flex px-2 cursor-pointer hover:text-gray-300"
          onClick={toggleDarkMode}
        >
          <MoonIcon className="h-6 w-6" strokeWidth={2} />
        </div>
      </div>

      <div className="w-full">
        <label className="sr-only" htmlFor="message">
          Message
        </label>
        <textarea
          className="w-full p-3 text-sm border border-gray-200 rounded-lg box-border dark:text-white dark:border-slate-400 dark:bg-gray-900"
          placeholder="Content"
          id="content"
          value={text}
          onChange={handleContentChange}
        ></textarea>
      </div>

      <div className="w-full">
        <input
          className="w-full p-2 text-sm border border-gray-200 rounded-lg box-border dark:text-white dark:border-slate-400 dark:bg-gray-900"
          id="search"
          placeholder="Search or Add Collection"
          type="text"
          onChange={searchCollection}
          ref={inputRef}
        />
      </div>

      {collections.length == 0 && searchKeyword == '' ? (
        <div className="p-2 text-black text-sm dark:text-white dark:border-slate-400 dark:bg-gray-900">
          <p>Collections not found !</p>
          <p>Use the input box above to add to a new collection</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-0.5 m-1">
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
        <div
          className="p-2 m-2 rounded-md text-black text-base text-center border cursor-pointer justify-center box-border hover:bg-gray-100 dark:text-white dark:border-slate-400 dark:bg-gray-900"
          onClick={newCollectionAndSave}
        >
          <span>New Collection</span>
          <PlusIcon className="inline ml-2 h-6 w-6" strokeWidth={2} />
        </div>
      ) : null}
    </div>
  );
}

export default Popup;
