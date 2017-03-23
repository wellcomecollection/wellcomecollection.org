/* global fetch */
import { setAsyncContentAdded } from '../reducers/async-content-added';

export default function asyncContent(el, dispatch) {
  return fetch(el.getAttribute('data-endpoint')).then(resp => resp.json()).then(json => {
    el.outerHTML = json.html;
    dispatch(setAsyncContentAdded(true));
  });
}
