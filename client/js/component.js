import { createStore } from 'redux';

export default function Component(getInitialState, reducers, setupDispatches, update) {
  return (el) => {
    const store = createStore((state, action) => {
      return reducers[action.type] ? reducers[action.type](state) : state;
    }, getInitialState(el));

    store.subscribe(function() {
      update(store.getState(), el);
    });

    setupDispatches(store.dispatch, el);
  };
}
