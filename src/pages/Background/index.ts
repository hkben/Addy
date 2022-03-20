import Storage from '../storage';
import Browser from 'webextension-polyfill';

import { IBrowserMessage } from '../interface';

const onInstalled = async () => {
  console.log('onInstalled');

  await Storage.onInstallCheck();
};

const onMessageListener = async (packet: IBrowserMessage, sender: any) => {
  console.log('onMessageListener');

  switch (packet.action) {
    case 'saveToCollection':
      // saveCurrentTabToCollection(packet.data!.collectionId);
      return;
  }
};

const onStartupListener = async () => {
  console.log('onStartupListener');
};

const onContextMenusCreated = async () => {
  console.log('onContextMenusCreated');
};

let contextMenusOnClick = async (
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

Browser.contextMenus.create(
  {
    title: 'Save Hightlighted Text',
    type: 'normal',
    contexts: ['selection'],
    onclick: contextMenusOnClick,
  },
  onContextMenusCreated
);

Browser.contextMenus.create(
  {
    title: 'Save Image',
    type: 'normal',
    contexts: ['image'],
    onclick: contextMenusOnClick,
  },
  onContextMenusCreated
);

Browser.contextMenus.create(
  {
    title: 'Save Bookmark',
    type: 'normal',
    contexts: ['page'],
    onclick: contextMenusOnClick,
  },
  onContextMenusCreated
);

Browser.runtime.onInstalled.addListener(onInstalled);
Browser.runtime.onStartup.addListener(onStartupListener);
Browser.runtime.onMessage.addListener(onMessageListener);
