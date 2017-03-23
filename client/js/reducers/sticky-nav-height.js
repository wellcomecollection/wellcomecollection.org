import {UPDATE_STICKY_NAV_HEIGHT} from '../actions';
const initialState = 0;

export function setStickyNavHeight(height) {
  return {
    type: UPDATE_STICKY_NAV_HEIGHT,
    height
  };
}

export const stickyNavHeight = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_STICKY_NAV_HEIGHT:
      return action.height;
    default:
      return state;
  }
};
