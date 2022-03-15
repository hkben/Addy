import React from 'react';
import { render } from 'react-dom';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../interface';
import Content from './Content';
import Storage from '../storage';

import css from '!!css-loader!sass-loader!./index.scss';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

let preload_popup = async () => {
  let shadowHost = document.createElement('section');
  document.body.appendChild(shadowHost);

  let shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

  let style = document.createElement('style');
  style.innerHTML = css.toString();
  shadowRoot.appendChild(style);

  let _setting = await Storage.getSetting();

  let contentDiv = document.createElement('div');
  contentDiv.id = 'webextension_content';

  if (_setting.darkMode) {
    contentDiv.setAttribute('data-theme', 'dark');
  }

  shadowRoot.appendChild(contentDiv);

  var reactElement = React.createElement(Content, _setting);

  render(reactElement, contentDiv);
};

window.addEventListener('load', preload_popup);
