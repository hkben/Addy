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

Browser.runtime.onInstalled.addListener(onInstalled);
Browser.runtime.onStartup.addListener(onStartupListener);
Browser.runtime.onMessage.addListener(onMessageListener);
