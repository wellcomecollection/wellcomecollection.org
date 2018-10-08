// @flow
import {classNames} from '../../../utils/classnames';
import {Component, Fragment} from 'react';
import {UiImage} from '../Images/Images';
import Icon from '../Icon/Icon';
import type {ImageType} from '../../../model/image';

type Props = {|
 image: ImageType,
 src: string
|}

type State = {|

  |}

const IframeElement = (image, src) => {
  if (image.contentUrl) {
    return (
      <iframe className='iframe-container__iframe absolute js-iframe'
        data-src={src}
        frameBorder='0'
        scrolling='no'
        allowvr
        allowFullScreen
        mozallowfullscreen='true'
        webkitallowfullscreen='true'
        onmousewheel=''></iframe>
    );
  } else {
    return (
      <iframe className='iframe-container__iframe absolute js-iframe'
        src={src}
        frameBorder='0'
        scrolling='no'
        allowvr
        allowFullScreen
        mozallowfullscreen='true'
        webkitallowfullscreen='true'
        onmousewheel=''></iframe>
    );
  }
};

class Iframe extends Component<Props, State> {
  // TODO remove 'data-track-event' once we're completely moved over to using Nextjs
  // TODO sizesQueries on image
  //  {% componentJsx 'UiImage', model.image | objectAssign({ sizesQueries: '(min-width: 600px) calc(98.5vw - 75px), calc(100vw - 36px)' }) %}
  render() {
    const { image, src } = this.props;
    const imageObject = {
      ...image,
      sizesQueries: '(min-width: 600px) calc(98.5vw - 75px), calc(100vw - 36px)'
    };
    const eventObject = {
      category: 'component',
      action: 'launch-iframe:click',
      label: `iframeSrc: ${src}`
    };

    return (
      <div className={classNames({
        'iframe-container relative': true,
        'js-iframe-container': Boolean(image.contentUrl)
      })}>
        {image.contentUrl &&
        <Fragment>
          <button className='iframe-container__trigger plain-button no-padding no-visible-focus absolute js-iframe-trigger'
            data-track-event={`${JSON.stringify(eventObject)}`}>
            <div className='iframe-container__overlay absolute'></div>
            <span className='iframe-container__launch absolute btn btn--primary js-iframe-launch'>Launch</span>
            <UiImage {...imageObject} />
          </button>
          <button className='iframe-container__close icon-rounder plain-button pointer no-padding absolute is-hidden js-iframe-close'>
            <Icon name='clear' title='Close' extraClasses='icon--white' />
          </button>
        </Fragment>
        }
        <IframeElement {...image} src={src} />
      </div>
    );
  }
};

export default Iframe;

// export default (el) => {
//   const iframeTrigger = el.querySelector('.js-iframe-trigger');
//   const originalIframe = el.querySelector('.js-iframe');
//   const launch = el.querySelector('.js-iframe-launch');
//   const originalLaunchText = launch.innerHTML;
//   const close = el.querySelector('.js-iframe-close');

//   iframeTrigger.addEventListener('click', loadIframe);
//   close.addEventListener('click', unloadIframe);

//   function loadIframe(event) {
//     const iframe = el.querySelector('.js-iframe');
//     const iframeSrc = iframe.getAttribute('data-src');

//     launch.innerHTML = 'Loading…';

//     iframe.setAttribute('src', iframeSrc);
//     iframe.addEventListener('load', hideTrigger);
//   }

//   function unloadIframe(event) {
//     const iframe = el.querySelector('.js-iframe');

//     iframe.removeEventListener('load', hideTrigger);

//     close.classList.add('is-hidden');
//     launch.innerHTML = originalLaunchText;
//     iframeTrigger.classList.remove('is-hidden');

//     el.removeChild(iframe);
//     originalIframe.setAttribute('src', ''); // IE 11 requires this to unload the iframe properly
//     el.appendChild(originalIframe);
//   }

//   function hideTrigger() {
//     iframeTrigger.classList.add('is-hidden');
//     close.classList.remove('is-hidden');
//   }
// };
