import { createReducer } from 'redux-act';

export default createReducer({
  INIT: (state, payload) => payload.session,
}, {
  isAuthenticated: '',
  user: {},
});
