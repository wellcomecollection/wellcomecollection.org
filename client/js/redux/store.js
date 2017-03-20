import { createStore, combineReducers } from 'redux';
import { stickyNav } from './reducers/sticky-nav';

const appReducer = combineReducers({
  stickyNav
});

// https://github.com/reactjs/redux/issues/303#issuecomment-125184409
// It isn't clear to me why this is better than using `subscribe()` directly
// but the docs (http://redux.js.org/docs/api/Store.html#subscribe) talk about
// it as being a low-level API and consequently recommend this approach.
// TODO: work out if/why this is required/preferred.
export const toObservable = (store) => {
  return {
    subscribe({ onNext }) {
      const unsubscribe = store.subscribe(() => {
        onNext(store.getState());
      });

      onNext(store.getState());

      return { unsubscribe };
    }
  };
};

export const store = createStore(appReducer);
