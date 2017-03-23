import { ASYNC_CONTENT_ADDED } from '../actions';
const initialState = false;

export function setAsyncContentAdded(value) {
  return {
    type: ASYNC_CONTENT_ADDED,
    value
  };
}

export const asyncContentAdded = (state = initialState, action) => {
  switch (action.type) {
    case ASYNC_CONTENT_ADDED:
      return action.value;
    default:
      return state;
  }
};
