import React from 'react';
import { render } from 'react-dom';

import '../../style.scss';
import './index.scss';
import Panel from './Component/Panel';

render(<Panel />, window.document.querySelector('#app-container'));
