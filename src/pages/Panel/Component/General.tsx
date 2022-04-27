import React, { useEffect } from 'react';
import {
  ICollection,
  ISetting,
  IStorage,
  SortElement,
} from '../../../common/interface';
import {
  Collection,
  Collections,
  Setting,
  Storage,
} from '../../../common/storage';

function General() {
  const [setting, setSetting] = React.useState<ISetting>(
    Setting.init() as ISetting
  );

  useEffect(() => {
    const getSetting = async () => {
      let _setting = await Setting.fetch();
      setSetting(_setting);
    };

    getSetting().catch(console.error);
  }, []);

  const handleOrderingSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = parseInt(event.currentTarget.value);

    let _setting = setting;
    _setting.collectionsOrdering.type = value;

    await Setting.update(_setting);

    setSetting((prevState) => ({
      ...prevState,
      collectionsOrdering: {
        ...prevState.collectionsOrdering,
        type: value,
      },
    }));
  };

  const handleDescendingCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.checked;

    let _setting = setting;
    _setting.collectionsOrdering.descending = value;

    await Setting.update(_setting);

    setSetting((prevState) => ({
      ...prevState,
      collectionsOrdering: {
        ...prevState.collectionsOrdering,
        descending: value,
      },
    }));
  };

  const handleQuickSearchCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.checked;

    let _setting = setting;
    _setting.quickSearch = value;

    await Setting.update(_setting);

    setSetting((prevState) => ({
      ...prevState,
      quickSearch: value,
    }));
  };

  const clearData = async () => {
    let result = await Storage.clear();

    if (result) {
      document.location.reload();
    }
  };

  const restoreDeleted = async () => {
    let result = await Collections.restore();

    if (result) {
      document.location.reload();
    }
  };

  const removeDeleted = async () => {
    let result = await Collections.removeDeleted(true);

    if (result) {
      document.location.reload();
    }
  };

  return (
    <div>
      <p className="text-3xl py-2">General</p>
      <div className="w-full text-sm divide-y">
        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Collections Ordering</p>
          </div>
          <div className="w-1/3 my-auto">
            <select
              className="h-10 px-4 w-full border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
              id="spaceing"
              value={
                setting.collectionsOrdering
                  ? setting.collectionsOrdering.type
                  : 0
              }
              onChange={handleOrderingSelection}
            >
              <option value="0">Default</option>
              <option value="1">Alphabetic</option>
              <option value="2">Created Time</option>
              <option value="3">Last Modify Time</option>
              <option value="4">Items Count</option>
            </select>
          </div>
        </div>
        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Descending Order</p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <input
              type="checkbox"
              className="w-6 h-6 border border-gray-200 rounded-lg"
              checked={
                setting.collectionsOrdering
                  ? setting.collectionsOrdering.descending
                  : false
              }
              onChange={handleDescendingCheckbox}
            />
          </div>
        </div>
        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Quick Search</p>
            Auto Focus on Search Box when opening Bookmark Popup
          </div>
          <div className="w-1/3 my-auto text-center">
            <input
              type="checkbox"
              className="w-6 h-6 border border-gray-200 rounded-lg"
              checked={setting.quickSearch}
              onChange={handleQuickSearchCheckbox}
            />
          </div>
        </div>
        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Restore Deleted</p>
            <p>Restore content that deleted in last 30 days</p>
            <p>
              (Deleted content will be delete permanently after 30 days
              automatically)
            </p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <button
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
              onClick={() => {
                const confirmBox = window.confirm(
                  'Do you really want to restore all deleted collections and items?'
                );
                if (confirmBox === true) {
                  restoreDeleted();
                }
              }}
            >
              Restore Deleted
            </button>
          </div>
        </div>
        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Remove Deleted Content</p>
            <p>
              This will only remove content on local. If the content exists in
              sync file, the deleted content will re-import to the database.
            </p>
          </div>
          <div className="w-1/3 my-auto text-center">
            <button
              className="px-4 py-2 text-white bg-amber-500 hover:bg-amber-700 rounded-md items-center"
              onClick={() => {
                const confirmBox = window.confirm(
                  'Do you really want to delete all deleted contnet permanently?'
                );
                if (confirmBox === true) {
                  removeDeleted();
                }
              }}
            >
              Remove Deleted Content
            </button>
          </div>
        </div>
        <div className="w-2/3 flex h-28">
          <div className="w-2/3 my-auto">
            <p className="text-base font-bold">Clear Data</p>
            Remove the data and reset it to a clean install
          </div>
          <div className="w-1/3 my-auto text-center">
            <button
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
              onClick={() => {
                const confirmBox = window.confirm(
                  'Do you really want to clear all data?'
                );
                if (confirmBox === true) {
                  clearData();
                }
              }}
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default General;
