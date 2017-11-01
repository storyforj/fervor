import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';

// import middleware
import thunkMiddleware from 'redux-thunk';
import logger from './utils/reduxLogger';

const middleware = [thunkMiddleware, logger];
const applied = applyMiddleware(...middleware);

const initStore = (initialState, otherMiddleware) => {
  const reducer = combineReducers({
    router: routerReducer,
  });
  let allMiddleware = applied;
  if (otherMiddleware) {
    allMiddleware = applyMiddleware(...middleware, ...otherMiddleware);
  }

  const store = (allMiddleware(createStore))(reducer);

  store.dispatch({
    type: '@@router/LOCATION_CHANGE',
    payload: initialState,
  });

  return store;
};

export default initStore;
