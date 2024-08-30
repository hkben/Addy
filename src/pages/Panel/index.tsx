import React from 'react';
import { createRoot } from 'react-dom/client';

import '@/style.scss';
import './index.scss';
import Panel from './Panel';

const container = window.document.querySelector('#app-container');
const root = createRoot(container!);
root.render(<Panel />);
