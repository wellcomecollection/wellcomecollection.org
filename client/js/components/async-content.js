/* global fetch */
export default function asyncContent(el) {
  return fetch(el.getAttribute('data-endpoint')).then(resp => resp.json()).then(json => {
    el.outerHTML = json.html;
    // TODO: dispatch action here/subscribe to setup contentSlider
  });
}
