// @flow
import {Fragment, Component} from 'react';
import {convertImageUri} from '../../../utils/convert-image-uri';
import {classNames} from '../../../utils/classnames';
import {imageSizes} from '../../../utils/image-sizes';
import Tasl from '../Tasl/Tasl';
import type {Node} from 'react';
import type {ImageType} from '../../../model/image';
import type {CaptionedImage as CaptionedImageProps} from '../../../model/captioned-image';
import Caption from '../Caption/Caption';

export type UiImageProps = {|
  ...ImageType,
  sizesQueries: string,
  extraClasses?: string,
  isFull?: boolean,
  showTasl?: boolean,
|}

export class UiImage extends Component<UiImageProps> {
  // TODO: set width of the image to 'auto' once the image has been lazy-loaded
  // and set the parent captioned-image__image-container to inline block, then
  // then trigger getImageSize() again
  state = {
    isEnhanced: false,
    isWidthAuto: true
  }

  setImgRef = el => {
    this.imgRef = el;
  }

  getImageSize = () => {
    this.props.setComputedImageWidth(this.imgRef.width);
  }

  checkImageLazyLoaded = () => {
    // TODO: this should be determined based on a lazy-image event that fires after it
    // has done its thing, rather than doing this polling
    if (this.state.isEnhanced && this.imgRef.classList.contains('lazyloaded')) {
      this.setState({
        isWidthAuto: true
      });
      this.props.setLazyLoaded();
      this.getImageSize();
    } else {
      setTimeout(this.checkImageLazyLoaded, 10);
    }
  }

  checkImageActuallyReady = () => {
    if (this.state.isEnhanced && this.imgRef.complete) {
      this.getImageSize();
    } else {
      setTimeout(this.checkImageActuallyReady, 0);
    }
  }

  componentDidMount() {
    this.checkImageActuallyReady();
    this.checkImageLazyLoaded();
    this.setState({
      isEnhanced: true,
      isWidthAuto: false
    });

    // TODO: debounce
    window.addEventListener('resize', this.getImageSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getImageSize);
  }

  render() {
    const {
      contentUrl,
      width,
      height,
      alt,
      tasl,
      sizesQueries,
      extraClasses = '',
      isFull = false,
      showTasl = true
    } = this.props;
    return (
      <Fragment>
        <noscript dangerouslySetInnerHTML={{__html: `
          <img width=${width}
            height=${height || ''}
            class='image image--noscript'
            style="width: auto;"
            src=${convertImageUri(contentUrl, 640, false)}
            alt=${alt} />`}} />

        {this.state.isEnhanced &&
          <img width={width}
            height={height}
            onLoad={this.getImageSize}
            ref={this.setImgRef}
            style={{
              width: this.state.isWidthAuto && 'auto'
            }}
            className={classNames({
              'lazy-image': true,
              'lazyload': true,
              'image': true,
              [extraClasses || '']: true
            })}
            src={convertImageUri(contentUrl, 30, false)}
            data-srcset={imageSizes(width).map(size => {
              return `${convertImageUri(contentUrl, size, false)} ${size}w`;
            })}
            sizes={sizesQueries}
            alt={alt} />
        }

        {showTasl && <Tasl {...tasl} isFull={isFull} />}
      </Fragment>
    );
  }
}

export type UiCaptionedImageProps = {|
  ...CaptionedImageProps,
  sizesQueries: string,
  extraClasses?: string,
  preCaptionNode?: Node,
  maxHeightRestricted?: boolean
|}

export class CaptionedImage extends Component<UiCaptionedImageProps> {
  state = {
    isActive: false,
    computedImageWidth: null,
    isWidthAuto: false
  }

  setComputedImageWidth = (width) => {
    this.setState({
      computedImageWidth: width,
      isActive: true
    });
  }

  setLazyLoaded = () => {
    this.setState({
      isWidthAuto: true
    });
  }

  render() {
    const { caption, preCaptionNode, extraClasses, image, sizesQueries, maxHeightRestricted } = this.props;
    const { isActive, computedImageWidth, isWidthAuto } = this.state;
    const uiImageProps = {...image, sizesQueries, maxHeightRestricted};

    return (
      <figure
        style={{
          marginLeft: isActive && isWidthAuto && '50%',
          transform: isActive && isWidthAuto && `translateX(${computedImageWidth / -2}px)`
        }}
        className={`captioned-image ${extraClasses}`}>
        <div
          style={{
            display: isWidthAuto && 'inline-block'
          }}
          className='captioned-image__image-container relative'>
          {/* https://github.com/facebook/flow/issues/2405 */}
          {/* $FlowFixMe */}
          <UiImage
            {...uiImageProps}
            setComputedImageWidth={this.setComputedImageWidth}
            setLazyLoaded={this.setLazyLoaded} />
        </div>
        <Caption
          width={computedImageWidth}
          caption={caption}
          preCaptionNode={preCaptionNode} />
      </figure>
    );
  }
}
