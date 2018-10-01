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
import debounce from 'lodash.debounce';

export type UiImageProps = {|
  ...ImageType,
  sizesQueries: string,
  extraClasses?: string,
  isFull?: boolean,
  showTasl?: boolean,
|}

export class UiImage extends Component<UiImageProps> {
  state = {
    isEnhanced: false,
    isWidthAuto: true
  }

  setImgRef = el => {
    this.imgRef = el;
    this.imgRef.addEventListener('lazyloaded', this.handleLazyLoaded);
  }

  getImageSize = () => {
    this.props.setComputedImageWidth(this.imgRef.width);
  }

  debouncedGetImageSize = debounce(this.getImageSize, 200);

  handleLazyLoaded = () => {
    this.props.setLazyLoaded(); // Inform parent
    this.setState({
      isWidthAuto: true // Fix aspect ratio
    });
    this.getImageSize(); // Update centre based on new aspect ratio
  }

  componentDidMount() {
    this.setState({
      isEnhanced: true,
      isWidthAuto: false
    });

    window.addEventListener('resize', this.debouncedGetImageSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedGetImageSize);
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
  setTitleStyle?: () => void
|}

export class CaptionedImage extends Component<UiCaptionedImageProps> {
  state = {
    isActive: false,
    computedImageWidth: null,
    isWidthAuto: false
  }

  setComputedImageWidth = (width) => {
    this.props.setTitleStyle && this.props.setTitleStyle(width);
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
    const { caption, preCaptionNode, extraClasses, image, sizesQueries } = this.props;
    const { isActive, computedImageWidth, isWidthAuto } = this.state;
    const uiImageProps = {...image, sizesQueries};

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
