import { createStore } from 'redux';

const reducers = {
  INIT: (previousState) => previousState,
  TOGGLE: (previousState) => {
    return Object.assign(previousState, {expanded: !previousState.expanded});
  }
};

function getInitialState(el) {
  const controlsId = el.getAttribute('aria-controls');
  const controlsEl = document.getElementById(controlsId);
  // as per W3 - expanded it true by default,
  const expanded = !(el.getAttribute('aria-expanded') === 'false');

  return { controlsEl, expanded };
}

function setupDispatches(dispatch, el) {
  dispatch({ type: 'INIT' });

  el.addEventListener('click', () => {
    dispatch({ type: 'TOGGLE' });
  });
}

function update(state, el) {
  const {expanded, controlsEl} = state;
  const display = expanded ? 'block' : 'none';

  // Do the DOM stuff
  el.setAttribute('aria-expanded', expanded);

  controlsEl.style.display = display;
}

function init(el) {
  const initialState = getInitialState(el);
  const store = createStore((state, action) => {
    return reducers[action.type] ? reducers[action.type](state) : state;
  }, initialState);

  store.subscribe(function() {
    update(store.getState(), el);
  });

  setupDispatches(store.dispatch, el);
}

export default init;
