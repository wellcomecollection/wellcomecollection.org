import { stickyNavHeight } from './sticky-nav-height';
import { asyncContentAdded } from './async-content-added';
import { combineReducers } from 'redux';

export const app = combineReducers({
  stickyNavHeight,
  asyncContentAdded
});
