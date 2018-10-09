// @flow
import {classNames} from '../../../utils/classnames';
import {trackGaEvent} from '../../../utils/tracking';
import React, {Component, Fragment} from 'react';
import {UiImage} from '../Images/Images';
import Icon from '../Icon/Icon';
import type {ImageType} from '../../../model/image';

type Props = {|
  image: ImageType,
  src: string
|}

type State = {|
  iframeShowing: boolean
|}

class Iframe extends Component<Props, State> {
  state = {
    iframeShowing: false
  }

  iframeRef = React.createRef();

  toggleIframeDisplay = () => {
    if (!this.state.iframeShowing) {
      trackGaEvent({
        category: 'component',
        action: 'launch-iframe:click',
        label: `iframeSrc:${this.props.src}`
      });
    }
    this.setState(prevState => ({
      iframeShowing: !prevState.iframeShowing
    }));
  }

  render() {
    const { image, src } = this.props;
    const imageObject = {
      ...image,
      sizesQueries: '(min-width: 1420px) 1010px, (min-width: 600px) 73vw, calc(100vw - 36px)'
    };

    return (
      <div className={classNames({
        'iframe-container relative': true,
        'js-iframe-container': Boolean(image.contentUrl)
      })}>
        {image.contentUrl &&
        <Fragment>
          {!this.state.iframeShowing && <button className='iframe-container__trigger plain-button no-padding no-visible-focus absolute'
            onClick={this.toggleIframeDisplay}>
            <span className='iframe-container__overlay absolute'></span>
            <span aria-live='polite' className='iframe-container__launch absolute btn btn--primary'>Launch</span>
          </button>}
          <UiImage {...imageObject} />
          {this.state.iframeShowing && <button className={classNames({
            'iframe-container__close icon-rounder plain-button pointer no-padding absolute': true,
            'is-hidden': !this.state.iframeShowing
          })}
          onClick={this.toggleIframeDisplay}>
            <Icon name='clear' title='Close' extraClasses='icon--white' />
          </button>}
        </Fragment>
        }
        {this.state.iframeShowing && <iframe className='iframe-container__iframe absolute'
          ref={this.iframeRef}
          src={src}
          frameBorder='0'
          scrolling='no'
          allowvr='true'
          allowFullScreen
          mozallowfullscreen='true'
          webkitallowfullscreen='true'
          onmousewheel='true'
        ></iframe>}
      </div>
    );
  }
};

export default Iframe;
