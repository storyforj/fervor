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
const errorModule = window.fervor && window.fervor.documentStatus && window.fervor.documentStatus === '500' ? fervorRoutes.e500 : fervorRoutes.e404;
let foundModule = () => Promise.resolve(errorModule);
let foundPath = window.fervor && window.fervor.documentStatus && window.fervor.documentStatus === '500' ? 'e500' : 'e404';

for (const path of Object.keys(fervorRoutes)) {
  if (pathToRegExp(path, undefined, {
    end: (typeof fervorRoutes[path] === 'object' && typeof fervorRoutes[path].exact === 'boolean') ?
      fervorRoutes[path].exact : true,
    strict: (typeof fervorRoutes[path] === 'object' && typeof fervorRoutes[path].strict === 'boolean') ?
      fervorRoutes[path].strict : false,
    sensitive: (typeof fervorRoutes[path] === 'object' && typeof fervorRoutes[path].sensitive === 'boolean') ?
      fervorRoutes[path].sensitive : false,
  }).test(location.pathname)) {
    foundModule = typeof fervorRoutes[path] === 'object' ? fervorRoutes[path].loader : fervorRoutes[path];
    foundPath = path;
    break;
  }
}

foundModule().then((PageLoadComponent) => {
  render({ Routes, componentCache: { [foundPath]: (PageLoadComponent && PageLoadComponent.default) || PageLoadComponent }, errorModule });
});

if (module.hot) {
  module.hot.accept();
}
