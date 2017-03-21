import { createStore, combineReducers } from 'redux';
import { stickyNav } from './reducers/sticky-nav';

const appReducer = combineReducers({
  stickyNav
});

export const store = createStore(appReducer);
