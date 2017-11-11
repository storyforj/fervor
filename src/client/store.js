import { routerMiddleware } from 'react-router-redux';

import browserHistory from './history';
import initStore from '../shared/store';

const pathname = `${document.location.pathname}${document.location.search}`;

const store = initStore(
  { router: { location: { pathname } } },
  [
    routerMiddleware(browserHistory),
  ],
);

export default store;
