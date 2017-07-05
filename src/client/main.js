import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { getUniversalState } from 'react-html-document';
import { Provider } from 'react-redux';

import initStore from './store';
import Routes from './routes';

const store = initStore(getUniversalState());

const render = (Component) => {
  ReactDOM.render(
    (
      <Provider store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    ),
    document.querySelectorAll('[data-reactroot]')[1],
  );
};

render(Routes);

if (module.hot) {
  // eslint-disable-next-line global-require
  module.hot.accept('./routes', () => render(require('./routes').default));
}
