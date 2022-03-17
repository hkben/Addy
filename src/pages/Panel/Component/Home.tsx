import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { ICollectionSummary, ISetting, SortElement } from '../../interface';
import Storage from '../../storage';
import CollectionViewer from './CollectionViewer';

interface State {
  collections: ICollectionSummary[];
  activeCollection: string;
}

function Home() {
  const newCollectionInput = useRef<HTMLInputElement>(null);

  const [collections, setCollections] = React.useState<ICollectionSummary[]>(
    [] as ICollectionSummary[]
  );

  const [activeCollection, setActiveCollection] = React.useState('');

  const [setting, setSetting] = React.useState<ISetting>({} as ISetting);

  useEffect(() => {
    const getSetting = async () => {
      let _setting = await Storage.getSetting();
      setSetting(_setting);
    };

    loadCollectionsList().catch(console.error);
    getSetting().catch(console.error);
  }, []);

  const loadCollectionsList = async () => {
    let summary = await Storage.getCollectionsSummary();

    setCollections(summary);

    if (activeCollection != '') {
      let isCollectionExists =
        _.filter(summary, (o) => o.id == activeCollection).length > 0
          ? true
          : false;

      if (isCollectionExists) {
        return;
      }
    }

    let firstCollection = summary[0].id;
    setActiveCollection(firstCollection);
  };

  const changeCollection = (_collectionId: string) => {
    console.log(_collectionId);
    setActiveCollection(_collectionId);
  };

  const newCollectionSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    let inputValue = newCollectionInput.current?.value || '';

    if (inputValue == '') {
      return;
    }

    await Storage.newCollection(inputValue);
    inputValue = '';

    await loadCollectionsList();
  };

  const handleOrderingSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = parseInt(event.currentTarget.value);

    setSetting((prevState) => ({
      ...prevState,
      collectionsOrdering: {
        ...prevState.collectionsOrdering,
        type: value,
      },
    }));
  };

  const handleDescendingOption = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    let value = setting.collectionsOrdering.descending ? false : true;

    setSetting((prevState) => ({
      ...prevState,
      collectionsOrdering: {
        ...prevState.collectionsOrdering,
        descending: value,
      },
    }));
  };

  useEffect(() => {
    if (setting.collectionsOrdering == null) {
      return;
    }

    let _collections = collections;

    if (setting.collectionsOrdering.type == SortElement.Name) {
      _collections = _.sortBy(_collections, (o) => o.name);
    }

    if (setting.collectionsOrdering.type == SortElement.Items) {
      _collections = _.sortBy(_collections, (o) => o.items);
    }

    if (setting.collectionsOrdering.type == SortElement.CreateTime) {
      _collections = _.sortBy(_collections, (o) => o.createTime);
    }

    if (setting.collectionsOrdering.type == SortElement.ModifyTime) {
      _collections = _.sortBy(_collections, (o) => o.modifyTime);
    }

    if (setting.collectionsOrdering.descending) {
      _collections = _.reverse(_collections);
    }

    console.log(_collections);

    setCollections(_collections);
  }, [setting]);

  return (
    <div className="container w-full flex flex-wrap mx-auto px-2 m-16">
      <div className="w-full lg:w-1/5 lg:px-6 text-xl text-gray-800 leading-normal dark:text-gray-50">
        <form onSubmit={newCollectionSubmit} className="flex gap-2 py-5">
          <input
            className="placeholder:italic block bg-white border border-slate-300 rounded-md p-2 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm dark:bg-gray-900 dark:text-gray-50"
            placeholder="New Collection"
            ref={newCollectionInput}
          />

          <button className="inline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </form>

        <p className="font-bold underline underline-offset-auto">Collections</p>

        <div className="py-4 my-auto text-sm">
          <select
            className="h-10 px-4 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="spaceing"
            value={
              setting.collectionsOrdering ? setting.collectionsOrdering.type : 0
            }
            onChange={handleOrderingSelection}
          >
            <option value="1">Alphabetic</option>
            <option value="2">Created Time</option>
            <option value="3">Last Modify Time</option>
            <option value="4">Items Count</option>
          </select>

          <span>
            <button onClick={handleDescendingOption}>
              {setting.collectionsOrdering &&
              setting.collectionsOrdering.descending ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline mx-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 inline mx-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
            </button>
          </span>
        </div>

        <ul>
          {collections.map((collection, index) => {
            return (
              <li
                key={index}
                onClick={() => changeCollection(collection.id)}
                className="py-1 cursor-pointer"
              >
                <p>
                  {collection.name}
                  <span className="text-sm"> ({collection.items})</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-4/5 p-8 text-gray-900 bg-white border border-gray-400 dark:text-gray-50 dark:bg-gray-800 dark:border-gray-400">
        <CollectionViewer
          collection={activeCollection}
          callback={loadCollectionsList}
        />
      </div>
    </div>
  );
}

export default Home;
