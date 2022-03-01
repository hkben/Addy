import React from 'react';
import { render } from 'react-dom';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../interface';
import Content from './Content';
import Storage from '../storage';

import css from '!!css-loader!sass-loader!./index.scss';

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

let toggleSelectionTool = async () => {
  if (init) {
    let event = new Event('onExtensionAction');
    window.dispatchEvent(event);
    return;
  }

  let shadowHost = document.createElement('section');
  document.body.appendChild(shadowHost);

  let shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

  let style = document.createElement('style');
  style.innerHTML = css.toString();
  shadowRoot.appendChild(style);

  let contentDiv = document.createElement('div');
  contentDiv.id = 'webextension_content';
  shadowRoot.appendChild(contentDiv);

  let _setting = await Storage.getSetting();

  var reactElement = React.createElement(Content, _setting);

  render(reactElement, contentDiv);

  init = true;
};

Browser.runtime.onMessage.addListener(onMessageListener);
