import React, { useEffect, useRef } from 'react';
import Browser from 'webextension-polyfill';
import CollectionButton from './CollectionButton';
import { ICollectionSummary, ISetting, SortElement } from '../interface';
import Storage from '../storage';
import Common from '../common';
import Settings from '../Panel/Component/Settings';
import _ from 'lodash';

function Popup() {
  const [text, setText] = React.useState<string>('');

  const [collections, setCollections] = React.useState<ICollectionSummary[]>(
    [] as ICollectionSummary[]
  );

  const [filteredCollections, setFilteredCollections] = React.useState<
    ICollectionSummary[]
  >([] as ICollectionSummary[]);

  const [searchKeyword, setSearchKeyword] = React.useState<string>('');

  const [newCollectionButton, setNewCollectionButton] = React.useState<boolean>(
    false
  );

  const [setting, setSetting] = React.useState<ISetting>();

  const inputRef = useRef<HTMLInputElement>(null);

  const getCollectionsSummary = async () => {
    let _collections = (await Storage.getCollectionsSummary()) as ICollectionSummary[];

    setCollections(_collections);
    setFilteredCollections(_collections);
  };

  const [darkMode, setDarkMode] = React.useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const getSetting = async () => {
      let _setting = await Storage.getSetting();

      setSetting(_setting);

      if (_setting.darkMode) {
        setDarkMode(true);
      }
    };

    getSetting().catch(console.error);

    getCollectionsSummary().catch(console.error);
  }, []);

  const saveTextToCollection = async (name: string) => {
    if (text == '') {
      return;
    }

    let url = await Common.getCurrentTab();

    await Storage.saveItemToCollection(name, text, 'text', url);
    window.close();
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

    if (value.length == 0) {
      sortAndSetFilteredCollections(collections);
      setNewCollectionButton(false);
      return;
    }

    let filtered = _.filter(collections, (o) =>
      o.name.toLowerCase().includes(value.toLowerCase())
    );

    let sameName = _.filter(
      filtered,
      (o) => o.name.toLowerCase() == value.toLowerCase()
    );

    if (sameName.length > 0) {
      setNewCollectionButton(false);
    } else {
      setNewCollectionButton(true);
    }

    sortAndSetFilteredCollections(filtered);
  };

  const sortAndSetFilteredCollections = (
    _collections: ICollectionSummary[]
  ) => {
    if (setting!.collectionsOrdering.type == SortElement.Name) {
      _collections = _.sortBy(_collections, (o) => o.name);
    }

    if (setting!.collectionsOrdering.type == SortElement.Items) {
      _collections = _.sortBy(_collections, (o) => o.items);
    }

    if (setting!.collectionsOrdering.type == SortElement.CreateTime) {
      _collections = _.sortBy(_collections, (o) => o.createTime);
    }

    if (setting!.collectionsOrdering.type == SortElement.ModifyTime) {
      _collections = _.sortBy(_collections, (o) => o.modifyTime);
    }

    if (setting!.collectionsOrdering.descending) {
      _collections = _.reverse(_collections);
    }

    setFilteredCollections(_collections);
  };

  const toggleDarkMode = async (event: React.MouseEvent<HTMLDivElement>) => {
    let _darkMode = darkMode ? false : true;

    setDarkMode(_darkMode);

    let setting = await Storage.getSetting();
    setting.darkMode = _darkMode;

    await Storage.updateSetting(setting);
  };

  return (
    <div className="overflow-hidden">
      <div className="flex justify-between py-2 text-base font-bold text-center bg-blue-500 text-white">
        <div
          className="inline-flex px-2 cursor-pointer hover:text-gray-300"
          onClick={openTab}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <div className="inline-flex my-auto">Addy</div>
        <div
          className="inline-flex px-2 cursor-pointer hover:text-gray-300"
          onClick={toggleDarkMode}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
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
          placeholder="Search Collection"
          type="text"
          onChange={searchCollection}
          ref={inputRef}
        />
      </div>

      <div className="flex flex-wrap gap-0.5 m-1">
        {filteredCollections.map((collection, index) => {
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
        <div className="p-2 m-2 rounded-md text-black text-base text-center border cursor-pointer justify-center box-border hover:bg-gray-100 dark:text-white dark:border-slate-400 dark:bg-gray-900">
          <span>New Collection</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline ml-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
}

export default Popup;
