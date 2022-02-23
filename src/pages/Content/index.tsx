import React from 'react';
import { render } from 'react-dom';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../interface';
import Content from './Content';

import './index.scss';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

let init: Boolean;

const onMessageListener = async (packet: IBrowserMessage, sender: any) => {
  switch (packet.action) {
    case 'saveText':
      toggleSelectionTool();
      return;
    case 'saveImage':
      console.log(packet.imageSrc!);
      return;
  }
};

let toggleSelectionTool = () => {
  if (init) {
    let event = new Event('onExtensionAction');
    window.dispatchEvent(event);
    return;
  }

  let div: HTMLDivElement;
  div = document.createElement('div');
  div.id = 'webext_selection_tool';
  document.body.appendChild(div);

  var reactElement = React.createElement(Content);

  render(reactElement, window.document.querySelector('#webext_selection_tool'));

  init = true;
};

Browser.runtime.onMessage.addListener(onMessageListener);
