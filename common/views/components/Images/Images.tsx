import { Fragment, Component, createRef } from 'react';
import debounce from 'lodash.debounce';
import { convertImageUri } from '../../../utils/convert-image-uri';
import { classNames } from '../../../utils/classnames';
import { imageSizes } from '../../../utils/image-sizes';
import Tasl from '../Tasl/Tasl';
import { ImageType } from '../../../model/image';

export type UiImageProps = ImageType & {
  sizesQueries: string;
  extraClasses?: string;
  isFull?: boolean;
  showTasl?: boolean;
  isWidthAuto?: boolean;
  setComputedImageWidth?: (value: number) => void;
  setIsWidthAuto?: (value: boolean) => void;
};

type UiImageState = {
  imgRef?: HTMLImageElement;
  isLazyLoaded: boolean;
};

export class UiImage extends Component<UiImageProps, UiImageState> {
  state: UiImageState = {
    imgRef: undefined,
    isLazyLoaded: false,
  };

  imgRef: { current: HTMLImageElement | null } = createRef();

  getImageSize = () => {
    this.state.imgRef &&
      this.props.setComputedImageWidth &&
      this.props.setComputedImageWidth(this.state.imgRef.width);
  };

  debouncedGetImageSize = debounce(this.getImageSize, 200);

  handleLazyLoaded = () => {
    this.props.setIsWidthAuto && this.props.setIsWidthAuto(true);
    this.getImageSize(); // Update centre based on new aspect ratio
    this.setState({ isLazyLoaded: true });
  };

  componentDidMount() {
    // In order for the image to take up 100% of the available horizontal
    // space, we remove `width: auto`. This is necessary for as long as the
    // parent container is not `display: inline-block`, and this is goverened
    // by whether the 'lazyloaded' event has fired on the img element, which
    // determines that the correct image is available at the the desired size.
    // At that point, setting `display: inline-block` on the parent container
    // ensures the TASL information button is correctly contained within the
    // image.
    this.setState({ imgRef: this.imgRef.current ?? undefined });
    this.imgRef.current &&
      this.imgRef.current.addEventListener('lazyloaded', this.handleLazyLoaded);
    this.props.setIsWidthAuto && this.props.setIsWidthAuto(false);

    window.addEventListener('resize', this.debouncedGetImageSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedGetImageSize);
    this.imgRef.current &&
      this.imgRef.current.removeEventListener(
        'lazyloaded',
        this.handleLazyLoaded
      );
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
      showTasl = true,
      isWidthAuto = false,
    } = this.props;

    return (
      <Fragment>
        <noscript
          className={`bg-charcoal font-white flex-inline`}
          dangerouslySetInnerHTML={{
            __html: `
          <img width='${width}'
            height='${height || ''}'
            class='image image--noscript bg-charcoal font-white'
            src=${convertImageUri(contentUrl, 640)}
            alt='${alt || ''}' />`,
          }}
        />

        <img
          width={width}
          height={height}
          onLoad={this.getImageSize}
          ref={this.imgRef}
          style={{
            width: isWidthAuto ? 'auto' : undefined,
          }}
          className={classNames({
            'lazy-image bg-charcoal font-white': true,
            lazyload: true,
            image: true,
            [extraClasses || '']: true,
          })}
          src={convertImageUri(contentUrl, 30)}
          data-srcset={imageSizes(width).map(size => {
            return `${convertImageUri(contentUrl, size)} ${size}w`;
          })}
          sizes={sizesQueries}
          alt={alt || ''}
        />

        {showTasl && <Tasl {...tasl} isFull={isFull} />}
      </Fragment>
    );
  }
}
