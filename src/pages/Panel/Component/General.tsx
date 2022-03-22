import React, { useEffect } from 'react';
import {
  ICollection,
  ISetting,
  IStorage,
  SortElement,
} from '../../../common/interface';
import { Setting, Storage } from '../../../common/storage';

function General() {
  const [setting, setSetting] = React.useState<ISetting>({} as ISetting);

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
      </div>
    </div>
  );
}

export default General;
