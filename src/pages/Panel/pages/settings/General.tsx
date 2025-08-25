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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArchiveRestoreIcon, ShredderIcon, Trash2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function General() {
  let { setting, updateSetting } = useSettingStore();

  const handleOrderingSelection = async (value: string) => {
    let collectionsOrdering = { ...setting!.collectionsOrdering };
    collectionsOrdering.type = Number(value);

    await updateSetting({ collectionsOrdering });
  };

  const handleDescendingCheckbox = async (value: boolean) => {
    let collectionsOrdering = { ...setting!.collectionsOrdering };
    collectionsOrdering.descending = value;

    await updateSetting({ collectionsOrdering });
  };

  const handleQuickSearchCheckbox = async (value: boolean) => {
    let quickSearch = setting!.quickSearch;
    quickSearch = value;

    await updateSetting({ quickSearch });
  };

  const handleFullWidthCheckbox = async (value: boolean) => {
    let viewingOption = { ...setting!.viewingOption };
    viewingOption.fullWidth = value;

    await updateSetting({ viewingOption });
  };

  const handleTimeDisplaySelection = async (value: string) => {
    let viewingOption = { ...setting!.viewingOption };
    viewingOption.timeDisplay = Number(value);

    await updateSetting({ viewingOption });
  };

  const handleImageSearchEngineSelection = async (value: string) => {
    let viewingOption = { ...setting!.viewingOption };
    viewingOption.imageSearchEngine = Number(value);

    await updateSetting({ viewingOption });
  };

  const handleDebugModeCheckbox = async (value: boolean) => {
    let debugMode = setting!.debugMode;
    debugMode = value;

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
          <Select
            value={
              setting!.collectionsOrdering
                ? String(setting!.collectionsOrdering.type)
                : '0'
            }
            onValueChange={handleOrderingSelection}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ordering" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Ordering</SelectLabel>
                <SelectItem value="0">Default</SelectItem>
                <SelectItem value="1">Alphabetic</SelectItem>
                <SelectItem value="2">Created Time</SelectItem>
                <SelectItem value="3">Last Modify Time</SelectItem>
                <SelectItem value="4">Items Count</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem title="Descending Order">
          <Switch
            checked={
              setting!.collectionsOrdering
                ? setting!.collectionsOrdering.descending
                : false
            }
            onCheckedChange={handleDescendingCheckbox}
          />
        </SettingItem>

        <SettingItem
          title="Quick Search"
          description="Auto Focus on Search Box when opening Bookmark Popup"
        >
          <Switch
            checked={setting!.quickSearch}
            onCheckedChange={handleQuickSearchCheckbox}
          />
        </SettingItem>

        <SettingItem
          title="Full Width Layout"
          description="Use the full width of the window to display Viewer Page"
        >
          <Switch
            checked={setting!.viewingOption.fullWidth}
            onCheckedChange={handleFullWidthCheckbox}
          />
        </SettingItem>

        <SettingItem title="Time Display">
          <Select
            value={
              setting!.viewingOption
                ? String(setting!.viewingOption.timeDisplay)
                : '0'
            }
            onValueChange={handleTimeDisplaySelection}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Time Display" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Display</SelectLabel>
                <SelectItem value="0">12-hour clock</SelectItem>
                <SelectItem value="1">24-hour clock</SelectItem>
                <SelectItem value="2">Relative Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem title="Image Search Engine">
          <Select
            value={
              setting!.viewingOption
                ? String(setting!.viewingOption.imageSearchEngine)
                : '0'
            }
            onValueChange={handleImageSearchEngineSelection}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Image Search Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Image Search Engine</SelectLabel>
                <SelectItem value="0">Google Lens</SelectItem>
                <SelectItem value="1">Bing</SelectItem>
                <SelectItem value="2">Yandex</SelectItem>
                <SelectItem value="3">TinEye</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingItem>

        <SettingItem
          title="Debug Mode"
          description="Display debug information in the console"
        >
          <Switch
            checked={setting!.debugMode}
            onCheckedChange={handleDebugModeCheckbox}
          />
        </SettingItem>

        <SettingItem
          title="Restore Deleted"
          description="Restore content that deleted in last 30 days"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <ArchiveRestoreIcon />
                Restore Deleted
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restore Deleted Content</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will restore all content deleted in the last 30
                  days. Do you really want to restore all deleted collections
                  and items?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={restoreDeleted}>
                  <ArchiveRestoreIcon />
                  <span>Continue</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingItem>

        <SettingItem
          title="Remove Deleted Content"
          description="This will permanently remove deleted content from your device. If the content is still present in a synced file, it may be restored during future syncs."
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2Icon />
                Remove Deleted Content
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Deleted Content</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently remove all content that has been
                  deleted. Do you really want to remove all deleted collections
                  and items? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: 'destructive' })}
                  onClick={removeDeleted}
                >
                  <Trash2Icon />
                  <span>Continue</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingItem>

        <SettingItem
          title="Clear Data"
          description="Remove the data and reset it to a clean install"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <ShredderIcon />
                Clear Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently remove all data and reset it to a
                  clean install. Do you really want to clear all data? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: 'destructive' })}
                  onClick={clearData}
                >
                  <ShredderIcon />
                  <span>Continue</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingItem>
      </div>
    </div>
  );
}

export default General;
