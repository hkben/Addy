import { Collection, Collections, Storage } from '../../common/storage';
import Browser from 'webextension-polyfill';

import { IBrowserMessage } from '../../common/interface';
import {
  autoSyncChecking,
  syncBackgroundRun,
  syncConnectionTest,
  syncFileDeletion,
} from './modules/sync';
import log from 'loglevel';

let isInit = false;

//Alarm Names
const autoSyncAlarmName = 'addy_auto_sync';
const autoCleanAlarmName = 'addy_auto_clean';

//Manifest Version and Browser Check
const isFirefox = Browser.runtime.getURL('').startsWith('moz-extension://');
const isChrome = Browser.runtime.getURL('').startsWith('chrome-extension://');

const manifest_version = Browser.runtime.getManifest().manifest_version;

let isServiceWorker = false;

log.info(
  `[Addy] Running Manifest version ${manifest_version} on ${
    isFirefox ? 'Firefox' : 'Chrome'
  }`
);

if (isChrome && manifest_version === 3) {
  isServiceWorker = true;
  log.info('[Addy] Running as Service Worker');
}

const init = async () => {
  if (manifest_version == 2 && !isInit) {
    //Version 2 would not call onInstalled on enabling extension,
    createContextMenus();
  }

  // Auto Sync Alarm
  const autoSyncAlarm = await Browser.alarms.get(autoSyncAlarmName);

  log.debug(`[Addy] Checking Alarm: ${autoSyncAlarmName}`, autoSyncAlarm);

  if (typeof autoSyncAlarm === 'undefined') {
    Browser.alarms.create(autoSyncAlarmName, {
      periodInMinutes: 10, // Every 10 minutes
    });

    log.debug(`[Addy] Created Alarm: ${autoSyncAlarmName}`);
  }

  // Auto Clean Alarm
  const autoCleanAlarm = await Browser.alarms.get(autoCleanAlarmName);

  log.debug(`[Addy] Checking Alarm: ${autoCleanAlarmName}`, autoCleanAlarm);

  if (typeof autoCleanAlarm === 'undefined') {
    Browser.alarms.create(autoCleanAlarmName, {
      periodInMinutes: 120, // Every 2 hours
    });

    log.debug(`[Addy] Created Alarm: ${autoCleanAlarmName}`);
  }

  isInit = true;
};

// Alarm Listener
Browser.alarms.onAlarm.addListener((alarmInfo) => {
  log.debug(`[Addy] Received Alarm: ${alarmInfo.name}`);

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
  log.debug('[Addy] onInstalledListener');
  await Storage.onInstallCheck();
  createContextMenus();

  log.setLevel('debug');
};

const onMessageListener = async (packet: IBrowserMessage, sender: any) => {
  log.debug('[Addy] onMessageListener');

  switch (packet.action) {
    case 'SyncBackgroundRun':
      syncBackgroundRun().catch(log.error);
      return;
    case 'SyncConnectionTest':
      syncConnectionTest().catch(log.error);
      return;
    case 'SyncFileDeletion':
      syncFileDeletion().catch(log.error);
      return;
  }
};

const onStartupListener = async () => {
  log.debug('[Addy] onStartupListener');
};

const onContextMenusCreated = async () => {
  log.debug('[Addy] onContextMenusCreated');
};

let onContextMenusClicked = async (
  info: Browser.Menus.OnClickData,
  tab?: Browser.Tabs.Tab
) => {
  log.debug(info);

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

  //Link
  if (info.linkUrl) {
    var message: IBrowserMessage = {
      action: 'saveLink',
      linkUrl: info.linkUrl,
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

  Browser.contextMenus.create(
    {
      id: 'save-link',
      title: 'Save Link as Bookmark',
      type: 'normal',
      contexts: ['link'],
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
