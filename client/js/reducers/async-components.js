import { UPDATE_ASYNC_COMPONENTS } from '../actions';
const initialState = [];

export function setAsyncComponents(component) {
  return {
    type: UPDATE_ASYNC_COMPONENTS,
    component
  };
}

export const asyncComponents = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ASYNC_COMPONENTS:
      return state.concat(action.component);
    default:
      return state;
  }
};
