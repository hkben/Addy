import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';

import '../../style.scss';
import './index.css';
import Browser from 'webextension-polyfill';
import { IBrowserMessage } from '../../common/interface';

const container = window.document.querySelector('#app-container');
const root = createRoot(container!);
root.render(<Popup />);

Browser.runtime.onMessage.addListener(onMessageListener);

function onMessageListener(info: IBrowserMessage) {}
