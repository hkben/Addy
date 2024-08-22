import { Collection, Collections, Storage } from '../../common/storage';
import Browser from 'webextension-polyfill';

import { IBrowserMessage } from '../../common/interface';
import {
  autoSyncChecking,
  syncBackgroundRun,
  syncConnectionTest,
  syncFileDeletion,
} from './modules/sync';

let isInit = false;

//Alarm Names
const autoSyncAlarmName = 'addy_auto_sync';
const autoCleanAlarmName = 'addy_auto_clean';

const isFirefox = Browser.runtime.getURL('').startsWith('moz-extension://');
const isChrome = Browser.runtime.getURL('').startsWith('chrome-extension://');

const manifest_version = Browser.runtime.getManifest().manifest_version;

const init = async () => {
  if (manifest_version == 2 && !isInit) {
    //Version 2 would not call onInstalled on enabling extension,
    createContextMenus();
  }

  // Auto Sync Alarm
  const autoSyncAlarm = await Browser.alarms.get(autoSyncAlarmName);

  console.log(`[Addy] Checking Alarm: ${autoSyncAlarmName}`, autoSyncAlarm);

  if (typeof autoSyncAlarm === 'undefined') {
    Browser.alarms.create(autoSyncAlarmName, {
      periodInMinutes: 10, // Every 10 minutes
    });

    console.log(`[Addy] Created Alarm: ${autoSyncAlarmName}`);
  }

  // Auto Clean Alarm
  const autoCleanAlarm = await Browser.alarms.get(autoCleanAlarmName);

  console.log(`[Addy] Checking Alarm: ${autoCleanAlarmName}`, autoCleanAlarm);

  if (typeof autoCleanAlarm === 'undefined') {
    Browser.alarms.create(autoCleanAlarmName, {
      periodInMinutes: 120, // Every 2 hours
    });

    console.log(`[Addy] Created Alarm: ${autoCleanAlarmName}`);
  }

  isInit = true;
};

// Alarm Listener
Browser.alarms.onAlarm.addListener((alarmInfo) => {
  console.log(`[Addy] Received Alarm: ${alarmInfo.name}`);

  switch (alarmInfo.name) {
    case autoSyncAlarmName:
      autoSyncChecking();
      break;
    case autoCleanAlarmName:
      Collections.removeDeleted();
      break;
  }
});

const onInstalledListener = async () => {
  //fired whem first installed, updated to a new version, and the browser updated to a new version
  console.log('onInstalledListener');
  await Storage.onInstallCheck();
  createContextMenus();
};

const onMessageListener = async (packet: IBrowserMessage, sender: any) => {
  console.log('onMessageListener');

  switch (packet.action) {
    case 'SyncBackgroundRun':
      syncBackgroundRun().catch(console.error);
      return;
    case 'SyncConnectionTest':
      syncConnectionTest().catch(console.error);
      return;
    case 'SyncFileDeletion':
      syncFileDeletion().catch(console.error);
      return;
  }
};

const onStartupListener = async () => {
  console.log('onStartupListener');
};

const onContextMenusCreated = async () => {
  console.log('onContextMenusCreated');
};

let onContextMenusClicked = async (
  info: Browser.Menus.OnClickData,
  tab?: Browser.Tabs.Tab
) => {
  console.log(info);

  var tabId: number = tab!.id!;

  //Text
  if (typeof info.selectionText != 'undefined') {
    var message: IBrowserMessage = {
      action: 'saveText',
    };

    Browser.tabs.sendMessage(tabId, message);
    return;
  }

  //Image
  if (info.mediaType == 'image') {
    var message: IBrowserMessage = {
      action: 'saveImage',
      imageSrc: info.srcUrl!,
    };

    Browser.tabs.sendMessage(tabId, message);
    return;
  }

  //Bookmark
  var message: IBrowserMessage = {
    action: 'saveBookmark',
  };

  Browser.tabs.sendMessage(tabId, message);
};

let createContextMenus = () => {
  Browser.contextMenus.create(
    {
      id: 'save-text',
      title: 'Save Hightlighted Text',
      type: 'normal',
      contexts: ['selection'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    },
    onContextMenusCreated
  );

  Browser.contextMenus.create(
    {
      id: 'save-image',
      title: 'Save Image',
      type: 'normal',
      contexts: ['image'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    },
    onContextMenusCreated
  );

  Browser.contextMenus.create(
    {
      id: 'save-bookmark',
      title: 'Save as Bookmark',
      type: 'normal',
      contexts: ['page'],
      documentUrlPatterns: ['http://*/*', 'https://*/*'],
    },
    onContextMenusCreated
  );
};

Browser.runtime.onInstalled.addListener(onInstalledListener);
Browser.runtime.onStartup.addListener(onStartupListener);
Browser.runtime.onMessage.addListener(onMessageListener);
Browser.contextMenus.onClicked.addListener(onContextMenusClicked);

init();
