import { createReducer } from 'redux-act';

export default createReducer({
  INIT: (state, payload) => payload.location,
  LOCATION_CHANGE: (state, payload) => payload.location,
}, {
  pathname: '/',
  search: '',
  hash: '',
});
