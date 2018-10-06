import {Component} from 'react';

type Props = {|

|}

type State = {|

|}

class Iframe extends Component<Props, State> {
  render() {
    return (
      <div>Iframe goes here</div>
    );
  }
};

export default Iframe;

// <div class="iframe-container relative {{ 'js-iframe-container' if model.image.contentUrl }}">
//   {% if model.image.contentUrl %}
//     <button class="iframe-container__trigger plain-button no-padding no-visible-focus absolute js-iframe-trigger"
//       data-track-event='{"category": "component", "action": "launch-iframe:click", "label": "iframeSrc:{{ model.src }}"}'>
//       <div class="iframe-container__overlay absolute"></div>
//       <span class="iframe-container__launch absolute btn btn--primary js-iframe-launch">Launch</span>
//       {% componentJsx 'UiImage', model.image | objectAssign({ sizesQueries: '(min-width: 600px) calc(98.5vw - 75px), calc(100vw - 36px)' }) %}
//     </button>
//     <button class="iframe-container__close icon-rounder plain-button pointer no-padding absolute is-hidden js-iframe-close">
//       {% icon 'clear', 'Close', ['icon--white'] %}
//     </button>
//   {% endif %}
//   <iframe class="iframe-container__iframe absolute js-iframe"
//     {% if model.image.contentUrl %}
//       data-src="{{ model.src }}"
//     {% else %}
//       src="{{ model.src }}"
//     {% endif %}
//     frameborder="0"
//     scrolling="no"
//     allowvr
//     allowfullscreen
//     mozallowfullscreen="true"
//     webkitallowfullscreen="true"
//     onmousewheel=""></iframe>
// </div>
