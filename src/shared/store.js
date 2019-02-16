import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';

// import middleware
import thunkMiddleware from 'redux-thunk';
import logger from './utils/reduxLogger';

const middleware = [thunkMiddleware, logger];
const applied = applyMiddleware(...middleware);

const initStore = (initialState, otherMiddleware, history) => {
  const reducer = combineReducers({
    router: connectRouter(history),
  });
  let allMiddleware = applied;
  if (otherMiddleware) {
    allMiddleware = applyMiddleware(...middleware, ...otherMiddleware);
  }
  const store = createStore(
    reducer,
    initialState,
    compose(allMiddleware),
  );

  return store;
};

export default initStore;
