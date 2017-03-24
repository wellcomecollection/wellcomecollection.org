/* global fetch */
import { setAsyncComponents } from '../reducers/async-components';

export default function asyncContent(el, dispatch) {
  const component = el.getAttribute('data-component');

  return fetch(el.getAttribute('data-endpoint')).then(resp => resp.json()).then(json => {
    el.outerHTML = json.html;
    dispatch(setAsyncComponents(component));
  });
}
