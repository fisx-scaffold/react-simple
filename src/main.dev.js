/**
 * @file 支持 HMR 重写的入口模块
 */

import patch from 'react-hot-loader/patch';
import AppContainer from 'react-hot-loader/lib/AppContainer';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <AppContainer>
        <App name="React"></App>
    </AppContainer>,
    document.getElementById('app')
);

