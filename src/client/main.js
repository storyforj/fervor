import pathToRegExp from 'path-to-regexp';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// eslint-disable-next-line
import fervorRoutes from 'fervorAppRoutes';

import App from './components/App';
import Routes from './components/Routes';

const render = (props) => {
  ReactDOM.hydrate(
    <AppContainer>
      <App {...props} />
    </AppContainer>,
    document.querySelector('#app'),
  );
};

/* eslint-disable no-restricted-globals, no-restricted-syntax */
let foundModule = fervorRoutes['404'];
const locationPathName = location.pathname;

for (const path of Object.keys(fervorRoutes)) {
  if (pathToRegExp(path).test(location.pathname)) {
    foundModule = fervorRoutes[path];
    break;
  }
}

foundModule().then((PageLoadComponent) => {
  render({ Routes, locationPathName, PageLoadComponent });
});

if (module.hot) {
  module.hot.accept();
}
