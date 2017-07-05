import { createStore, combineReducers, applyMiddleware } from 'redux';

// import middleware
import thunkMiddleware from 'redux-thunk';
import logger from './utils/reduxLogger';

// import reducers
import location from './utils/reducerLocation';
import session from './utils/reducerSession';

const reducer = combineReducers({
  location,
  session,
});

const middleware = applyMiddleware(
  thunkMiddleware,
  logger,
);

const initStore = (initialState) => {
  const store = (middleware(createStore))(reducer);

  // include initial data
  store.dispatch({
    type: 'INIT',
    payload: initialState,
  });

  return store;
};

export default initStore;
