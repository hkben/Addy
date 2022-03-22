import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';

import '../../style.scss';
import './index.css';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../common/interface';

render(<Popup />, window.document.querySelector('#app-container'));

Browser.runtime.onMessage.addListener(onMessageListener);

function onMessageListener(info: IBrowserMessage) {}
