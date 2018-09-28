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
  // TODO: Could this take a grid sizing object, and work out the queries
  // automatically?
  // Grid sizing object = {| ['s', 'm', 'l', 'xl']: number |}
  sizesQueries: string,
  extraClasses?: string,
  isFull?: boolean,
  showTasl?: boolean
|}

export class UiImage extends Component<UiImageProps> {
  setImgRef = el => {
    this.imgRef = el;
  }

  getImageSize = () => {
    console.log(this.imgRef.width);
    this.props.setComputedImageWidth(this.imgRef.width);
  }

  checkImageActuallyReady = () => {
    if (this.imgRef.complete && this.imgRef.width > 0) {
      this.getImageSize();
    } else {
      console.log('checking');
      setTimeout(this.checkImageActuallyReady, 1);
    }
  }

  componentDidMount() {
    this.checkImageActuallyReady();

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
            src=${convertImageUri(contentUrl, 640, false)}
            alt=${alt} />`}} />

        <img width={width}
          height={height}
          onLoad={this.getImageSize}
          ref={this.setImgRef}
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
    computedImageWidth: null
  }

  setComputedImageWidth = (width) => {
    this.setState({
      computedImageWidth: width,
      isActive: true
    });
  }

  render() {
    const { caption, preCaptionNode, extraClasses, image, sizesQueries, maxHeightRestricted } = this.props;
    const { isActive, computedImageWidth } = this.state;
    const uiImageProps = {...image, sizesQueries, maxHeightRestricted};

    return (
      <figure
        style={{
          marginLeft: isActive && '50%',
          transform: isActive && `translateX(${computedImageWidth / -2}px)`
        }}
        className={`captioned-image ${extraClasses}`}>
        <div className='captioned-image__image-container relative'>
          {/* https://github.com/facebook/flow/issues/2405 */}
          {/* $FlowFixMe */}
          <UiImage {...uiImageProps} setComputedImageWidth={this.setComputedImageWidth} />
        </div>
        <Caption
          width={computedImageWidth}
          caption={caption}
          preCaptionNode={preCaptionNode} />
      </figure>
    );
  }
}
