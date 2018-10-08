// @flow
import {classNames} from '../../../utils/classnames';
import React, {Component, Fragment} from 'react';
import {UiImage} from '../Images/Images';
import Icon from '../Icon/Icon';
import type {ImageType} from '../../../model/image';

type Props = {|
  image: ImageType,
  src: string
|}

type State = {|
  // iframeLoading: boolean,
  iframeShowing: boolean
|}

class Iframe extends Component<Props, State> {
  state = {
    // iframeLoading: false,
    iframeShowing: false
  }

  iframeRef = React.createRef();

  // updateIframeLoadedState = () => {
  //   this.setState({
  //     iframeLoaded: !this.state.iframeLoaded
  //   });
  // }

  toggleIframeDisplay = () => {
    this.setState(prevState => ({
      iframeShowing: !prevState.iframeShowing
    }));
  }

  // TODO remove 'data-track-event' once we're completely moved over to using Nextjs
  // TODO remove 'js-...' classes once we're completely moved over to using Nextjs
  render() {
    const { image, src } = this.props;
    const imageObject = {
      ...image,
      sizesQueries: '(min-width: 1420px) 1010px, (min-width: 600px) 73vw, calc(100vw - 36px)'
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
          {!this.state.iframeShowing && <button className='iframe-container__trigger plain-button no-padding no-visible-focus absolute js-iframe-trigger'
            data-track-event={`${JSON.stringify(eventObject)}`}
            onClick={this.toggleIframeDisplay}>
            <span className='iframe-container__overlay absolute'></span>
            <span className='iframe-container__launch absolute btn btn--primary js-iframe-launch'>Launch</span>
          </button>}
          <UiImage {...imageObject} />
          {this.state.iframeShowing && <button className={classNames({
            'iframe-container__close icon-rounder plain-button pointer no-padding absolute js-iframe-close': true,
            'is-hidden': !this.state.iframeShowing
          })}
          onClick={this.toggleIframeDisplay}>
            <Icon name='clear' title='Close' extraClasses='icon--white' />
          </button>}
        </Fragment>
        }
        {this.state.iframeShowing && <iframe className='iframe-container__iframe absolute js-iframe'
          ref={this.iframeRef}
          src={src}
          frameBorder='0'
          scrolling='no'
          allowvr='true'
          allowFullScreen
          mozallowfullscreen='true'
          webkitallowfullscreen='true'
        /* onmousewheel='' TODO causes error in React */
        ></iframe>}
      </div>
    );
  }
};

export default Iframe;
// TODO loading - loaded...
// TODO add tracking
// TODO test in IE11
