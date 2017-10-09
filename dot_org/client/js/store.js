import { createStore } from 'redux';
import { app } from './reducers/app';
import xs from 'xstream';

function createStreamFromStore(store) {
  const storeProducer = {
    start(listener) {
      listener.next(store.getState());
      this.dispose = store.subscribe(() => listener.next(store.getState()));
    },
    stop() {
      this.dispose();
    },
    dispose: null
  };

  const store$ = xs.create(storeProducer);

  return {
    store$,
    dispatch(action) {
      store.dispatch(action);
    }
  };
}

export const {store$, dispatch} = createStreamFromStore(createStore(app));
