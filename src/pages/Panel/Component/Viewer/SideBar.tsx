import React, { useEffect, useRef } from 'react';
import { ICollectionSummary, IOrdering } from '../../../../common/interface';
import { useSortCollections } from '../../../../common/hook/useSortCollections';
import Setting from '../../../../common/storage/setting';
import { Link } from 'react-router-dom';
import {
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Collection, Collections } from '../../../../common/storage';
import _ from 'lodash';

function SideBar() {
  const newCollectionInput = useRef<HTMLInputElement>(null);

  const [collections, setCollections] = React.useState<ICollectionSummary[]>(
    [] as ICollectionSummary[]
  );

  const [activeCollection, setActiveCollection] = React.useState('');

  const [ordering, setOrdering] = React.useState<IOrdering>({} as IOrdering);

  const [searchKeyword, setSearchKeyword] = React.useState<string>('');

  const sortedCollections = useSortCollections(
    collections,
    ordering,
    searchKeyword
  );

  useEffect(() => {
    getOrdering().catch(console.error);
    loadCollectionsList().catch(console.error);
  }, []);

  useEffect(() => {
    //Avoid activeCollection changing when reloading CollectionsList
    if (activeCollection != '') {
      let isCollectionExists =
        _.filter(collections, (o) => o.id == activeCollection).length > 0
          ? true
          : false;

      if (isCollectionExists) {
        return;
      }
    }

    if (sortedCollections.length > 0) {
      let firstCollection = sortedCollections[0].id;
      setActiveCollection(firstCollection);
    }
  }, [sortedCollections]);

  const getOrdering = async () => {
    let _ordering = await Setting.fetchOrdering();
    setOrdering(_ordering);
  };

  const loadCollectionsList = async () => {
    let summary = await Collections.fetchSummary();
    setCollections(summary);
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

    await Collection.create(inputValue);
    inputValue = '';

    await loadCollectionsList();
  };

  const handleOrderingSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = parseInt(event.currentTarget.value);

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

  return (
    <div>
      <p className="font-bold underline underline-offset-auto">Collections</p>

      <form onSubmit={newCollectionSubmit} className="pt-3 pb-1 flex">
        <input
          className="w-full placeholder:italic block bg-white border border-slate-300 rounded-md p-2 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm dark:bg-gray-900 dark:text-gray-50"
          placeholder="Search or Add Collection"
          onChange={searchCollection}
          ref={newCollectionInput}
        />

        <button className="inline px-2">
          <PencilSquareIcon className="h-6 w-6" strokeWidth={2} />
        </button>
      </form>

      <div className="w-full pt-1 pb-3 my-auto text-sm">
        <select
          className="w-5/6 h-10 px-4 inline-block border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
          id="spaceing"
          value={ordering ? ordering.type : 0}
          onChange={handleOrderingSelection}
        >
          <option value="1">Alphabetic</option>
          <option value="2">Created Time</option>
          <option value="3">Last Modify Time</option>
          <option value="4">Items Count</option>
        </select>

        <span className="w-1/6 inline-block">
          <button onClick={handleDescendingOption}>
            {ordering && ordering.descending ? (
              <ChevronDownIcon
                className="h-6 w-6 inline mx-2"
                strokeWidth={2}
              />
            ) : (
              <ChevronUpIcon className="h-6 w-6 inline mx-2" strokeWidth={2} />
            )}
          </button>
        </span>
      </div>

      <ul>
        {sortedCollections.map((collection, index) => {
          return (
            <Link to={`/${collection.id}`} key={index}>
              <li className="py-1 cursor-pointer">
                <p>
                  {collection.name}
                  <span className="text-sm"> ({collection.items})</span>
                  {collection.color != null && collection.color != 0 ? (
                    <span
                      className={`mx-1 rounded-full inline-block h-3 w-3 color-${collection.color}`}
                    ></span>
                  ) : (
                    ''
                  )}
                </p>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default SideBar;
