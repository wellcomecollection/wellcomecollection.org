export const stickyNav = (state = {height: 0}, action) => {
  switch (action.type) {
    case 'UPDATE_STICKY_NAV_HEIGHT':
      return Object.assign({}, state, {height: action.value});
    default:
      return state;
  }
};
