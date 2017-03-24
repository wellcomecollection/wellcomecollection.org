import { stickyNavHeight } from './sticky-nav-height';
import { asyncComponents } from './async-components';
import { combineReducers } from 'redux';

export const app = combineReducers({
  stickyNavHeight,
  asyncComponents
});
