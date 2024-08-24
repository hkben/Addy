import React from 'react';
import { render } from 'react-dom';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../common/interface';
import Content from './Content';
import { Setting } from '../../common/storage';
import log from 'loglevel';

import css from '!!css-loader!sass-loader!./index.scss';

const isFirefox = Browser.runtime.getURL('').startsWith('moz-extension://');

log.trace('[Addy] Content script works!');
log.info('[Addy] Must reload extension for modifications to take effect.');

const elementId = 'webextension_addy_popup';

let preload_popup = async () => {
  if (document.getElementById(elementId)) {
    log.error('[Addy] popup already loaded');
    return;
  }

  let shadowHost = document.createElement('section');
  shadowHost.style.cssText = 'position:absolute;top:0;left:0;';
  shadowHost.id = elementId;

  document.body.appendChild(shadowHost);

  let shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

  let style = document.createElement('style');
  style.innerHTML = css.toString();
  shadowRoot.appendChild(style);

  let _setting = await Setting.fetch();

  let contentDiv = document.createElement('div');
  contentDiv.id = 'webextension_content';

  if (_setting.darkMode) {
    contentDiv.setAttribute('data-theme', 'dark');
  }

  shadowRoot.appendChild(contentDiv);

  var reactElement = React.createElement(Content, _setting);

  render(reactElement, contentDiv);
};

window.addEventListener('load', function (event: Event) {
  if (event.isTrusted) {
    //Block load event created by a script
    preload_popup();
  }
});

// If open image in new tab in firefox, on load event is not triggered on first load
// This is a workaround for that
// preload_popup would check if popup is already loaded for page refreshes (which on load would trigger)
if (isFirefox && document.toString().includes('ImageDocument')) {
  setTimeout(() => {
    preload_popup();
  }, 1000);
}
