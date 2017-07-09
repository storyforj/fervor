import isNode from 'is-node';

/* eslint-disable arrow-parens, no-console */
const logger = store => next => action => {
  // only log if browser
  if (!isNode) {
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
    return result;
  }

  return next(action);
};
/* eslint-enable arrow-parens, no-console */

export default logger;
