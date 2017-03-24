import { ASYNC_CONTENT_ADDED } from '../actions';
const initialState = [];

export function setAsyncContentAdded(component) {
  return {
    type: ASYNC_CONTENT_ADDED,
    component
  };
}

export const asyncContentAdded = (state = initialState, action) => {
  switch (action.type) {
    case ASYNC_CONTENT_ADDED:
      return state.concat(action.component);
    default:
      return state;
  }
};
