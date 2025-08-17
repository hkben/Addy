import React, { useEffect } from 'react';
import {
  ICollection,
  ISetting,
  IStorage,
  SortElement,
} from '@/common/interface';
import { Collection, Collections, Setting, Storage } from '@/common/storage';
import log from 'loglevel';
import useSettingStore from '@/common/store/useSettingStore';
import SettingItem from '../../components/settings/SettingItem';

function General() {
  let { setting, updateSetting } = useSettingStore();

  const handleOrderingSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = parseInt(event.currentTarget.value);

    let collectionsOrdering = { ...setting!.collectionsOrdering };
    collectionsOrdering.type = value;

    await updateSetting({ collectionsOrdering });
  };

  const handleDescendingCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.checked;

    let collectionsOrdering = { ...setting!.collectionsOrdering };
    collectionsOrdering.descending = value;

    await updateSetting({ collectionsOrdering });
  };

  const handleQuickSearchCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.checked;

    let quickSearch = setting!.quickSearch;
    quickSearch = value;

    await updateSetting({ quickSearch });
  };

  const handleTimeDisplaySelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = parseInt(event.currentTarget.value);

    let viewingOption = { ...setting!.viewingOption };
    viewingOption.timeDisplay = value;

    await updateSetting({ viewingOption });
  };

  const handleImageSearchEngineSelection = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = parseInt(event.currentTarget.value);

    let viewingOption = { ...setting!.viewingOption };
    viewingOption.imageSearchEngine = value;

    await updateSetting({ viewingOption });
  };

  const handleDebugModeCheckbox = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.currentTarget.checked;

    let debugMode = setting!.debugMode;
    debugMode = value ? true : false;

    await updateSetting({ debugMode });
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
      <div className="grid gap-1 mb-4">
        <p className="text-3xl font-bold py-2">General</p>
        <p className="text-muted-foreground">
          General settings for the application
        </p>
      </div>

      <div className="w-full text-sm divide-y">
        <SettingItem
          title="Collections Ordering"
          description="Choose how collections are ordered in the app."
        >
          <select
            className="h-10 px-4 w-full border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="spaceing"
            value={
              setting!.collectionsOrdering
                ? setting!.collectionsOrdering.type
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
        </SettingItem>

        <SettingItem title="Descending Order">
          <input
            type="checkbox"
            className="w-6 h-6 border border-gray-200 rounded-lg"
            checked={
              setting!.collectionsOrdering
                ? setting!.collectionsOrdering.descending
                : false
            }
            onChange={handleDescendingCheckbox}
          />
        </SettingItem>

        <SettingItem
          title="Quick Search"
          description="Auto Focus on Search Box when opening Bookmark Popup"
        >
          <input
            type="checkbox"
            className="w-6 h-6 border border-gray-200 rounded-lg"
            checked={setting!.quickSearch}
            onChange={handleQuickSearchCheckbox}
          />
        </SettingItem>

        <SettingItem title="Time Display">
          <select
            className="h-10 px-4 w-full border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="spaceing"
            value={
              setting!.viewingOption ? setting!.viewingOption.timeDisplay : 0
            }
            onChange={handleTimeDisplaySelection}
          >
            <option value="0">12-hour clock</option>
            <option value="1">24-hour clock</option>
            <option value="2">Relative Time</option>
          </select>
        </SettingItem>

        <SettingItem title="Image Search Engine">
          <select
            className="h-10 px-4 w-full border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="spaceing"
            value={
              setting!.viewingOption
                ? setting!.viewingOption.imageSearchEngine
                : 0
            }
            onChange={handleImageSearchEngineSelection}
          >
            <option value="0">Google Lens</option>
            <option value="1">Bing</option>
            <option value="2">Yandex</option>
            <option value="3">TinEye</option>
          </select>
        </SettingItem>

        <SettingItem
          title="Debug Mode"
          description="Display debug information in the console"
        >
          <input
            type="checkbox"
            className="w-6 h-6 border border-gray-200 rounded-lg"
            checked={setting!.debugMode}
            onChange={handleDebugModeCheckbox}
          />
        </SettingItem>

        <SettingItem
          title="Restore Deleted"
          description="Restore content that deleted in last 30 days"
        >
          <button
            className="px-5 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
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
        </SettingItem>

        <SettingItem
          title="Remove Deleted Content"
          description="This will only remove content on local. If the content exists in sync file, the deleted content will re-import to the database."
        >
          <button
            className="px-5 py-2 text-white bg-amber-500 hover:bg-amber-700 rounded-md items-center"
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
        </SettingItem>

        <SettingItem
          title="Clear Data"
          description="Remove the data and reset it to a clean install"
        >
          <button
            className="px-5 py-2 text-white bg-red-500 hover:bg-red-700 rounded-md items-center"
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
        </SettingItem>
      </div>
    </div>
  );
}

export default General;
