// @flow

import {convertImageUri} from '../../../utils/convert-image-uri';
import {imageSizes} from '../../../utils/image-sizes';

type Props = {|
  width: number,
  height?: string,
  contentUrl: string,
  clipPathClass?: string,
  alt: string,
  caption?: string,
  lazyload?: boolean,
  sizesQueries?: string,
  copyright?: string,
  defaultSize?: number,
  clickHandler?: () => void,
  zoomable?: boolean
|}

const Image = ({
  width,
  height,
  contentUrl,
  clipPathClass,
  caption,
  lazyload,
  copyright,
  sizesQueries = '100vw',
  defaultSize = 30,
  alt = '',
  clickHandler,
  zoomable
}: Props) => (
  <div className="work-media__image-container">
    <noscript>
      <img width={width}
        height={height}
        className='image image--noscript'
        src={convertImageUri(contentUrl, 640, false)}
        alt={alt} />
    </noscript>
    {imageMarkup(width, height, clipPathClass, lazyload, defaultSize, contentUrl, sizesQueries, copyright, alt, caption, clickHandler, zoomable)}
  </div>
);

const imageClasses = (clip = false, lazyload: boolean, clipPathClass, zoomable) => {
  const lazyloadClass = lazyload ? 'lazy-image lazyload' : '';
  const clipClass = clip ? `promo__image-mask ${clipPathClass || ''}` : '';
  const zoomClass = zoomable ? 'cursor-zoom-in' : '';

  return `image ${lazyloadClass} ${clipClass} ${zoomClass}`;
};

const imageMarkup = (width, height, clipPathClass, lazyload = false, defaultSize, contentUrl, sizesQueries, copyright, alt, caption, clickHandler, zoomable) => {
  const sizes = imageSizes(width);
  const baseMarkup = clip => (
    <img width={width}
      height={height}
      className={imageClasses(clip, lazyload, clipPathClass, zoomable)}
      src={convertImageUri(contentUrl, defaultSize, false)}
      data-srcset={sizes.map(size => {
        return `${convertImageUri(contentUrl, size, false)} ${size}w`;
      })}
      data-copyright={copyright}
      onClick={clickHandler} />
  );

  return clipPathClass ? [
    baseMarkup(),
    baseMarkup(true)]
    : baseMarkup();
};

export default Image;
