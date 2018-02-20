// @flow

import {convertImageUri} from '../../../utils/convert-image-uri';
import {imageSizes} from '../../../utils/image-sizes';
import {Fragment} from 'react';

export type Props = {|
  width: number,
  height?: string,
  contentUrl: string,
  clipPathClass?: string,
  alt: string,
  caption?: string,
  lazyload?: boolean,
  sizesQueries?: string,
  copyright?: string,
  defaultSize?: number
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
  alt = ''
}: Props) => (
  <Fragment>
    <noscript>
      <img width={width}
        height={height}
        className='image image--noscript'
        src={convertImageUri(contentUrl, 640, false)}
        alt={alt} />
    </noscript>
    {imageMarkup(width, height, clipPathClass, lazyload, defaultSize, contentUrl, sizesQueries, copyright, alt, caption)}
  </Fragment>
);

const imageClasses = (clip = false, lazyload: boolean, clipPathClass) => {
  const lazyloadClass = lazyload ? 'lazy-image lazyload' : '';
  const clipClass = clip ? `promo__image-mask ${clipPathClass || ''}` : '';

  return `image ${lazyloadClass} ${clipClass}`;
};

const imageMarkup = (width, height, clipPathClass, lazyload = false, defaultSize, contentUrl, sizesQueries, copyright, alt, caption) => {
  const sizes = imageSizes(width);
  const baseMarkup = clip => (
    <img width={width}
      height={height}
      className={imageClasses(clip, lazyload, clipPathClass)}
      src={convertImageUri(contentUrl, defaultSize, false)}
      data-srcset={sizes.map(size => {
        return `${convertImageUri(contentUrl, size, false)} ${size}w`;
      })}
      data-copyright={copyright}
      alt={alt} />
  );

  return clipPathClass ? [
    baseMarkup(),
    baseMarkup(true)]
    : baseMarkup();
};

export default Image;
