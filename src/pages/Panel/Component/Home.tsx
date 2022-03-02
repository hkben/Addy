import React, { useEffect, useRef } from 'react';
import { ICollectionSummary } from '../../interface';
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

  useEffect(() => {
    loadCollectionsList().catch(console.error);
  }, []);

  const loadCollectionsList = async () => {
    let summary = await Storage.getCollectionsSummary();

    let firstCollection = summary[0].id;

    setCollections(summary);
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

  return (
    <div className="container w-full flex flex-wrap mx-auto px-2 m-16">
      <div className="w-full lg:w-1/5 lg:px-6 text-xl text-gray-800 leading-normal">
        <form onSubmit={newCollectionSubmit} className="flex gap-2 py-5">
          <input
            className="placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md p-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
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

        <p className="font-black underline underline-offset-8">Collections</p>

        <ul className="py-5">
          {collections.map((collection, index) => {
            return (
              <li
                key={index}
                onClick={() => changeCollection(collection.id)}
                className="py-1 cursor-pointer"
              >
                <p>{collection.name}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="w-4/5 p-8 text-gray-900 bg-white border border-gray-400">
        <CollectionViewer
          collection={activeCollection}
          callback={loadCollectionsList}
        />
      </div>
    </div>
  );
}

export default Home;
