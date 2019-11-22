// @flow
import { classNames } from '../../../utils/classnames';
import { convertImageUri } from '../../../utils/convert-image-uri';
import { imageSizes } from '../../../utils/image-sizes';
import { Fragment } from 'react';
import type { ImageType } from '../../../model/image';

export type Props = {|
  contentUrl: string,
  width: number,
  alt: string,
  height?: number,
  clipPathClass?: ?string,
  caption?: string,
  lazyload?: boolean,
  sizesQueries?: string,
  copyright?: string,
  defaultSize?: number,
  clickHandler?: () => void,
  zoomable?: boolean,
  extraClasses?: string,
  crops?: {| [string]: ImageType |},
  style?: { [string]: any }, // TODO: find flowtype for this
|};

const Image = (props: Props) => {
  const classes = classNames({
    'image image--noscript bg-charcoal font-white': true,
    [`${props.extraClasses || ''}`]: Boolean(props.extraClasses),
  });
  return (
    <Fragment>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
      <img width='${props.width}'
        height='${props.height || ''}'
        class='${classes}'
        src='${convertImageUri(props.contentUrl, 640)}'
        alt='${props.alt || ''}' />`,
        }}
      />

      {props.clipPathClass ? (
        <Fragment>
          <Img {...props} clipPathClass={null} />
          <Img {...props} />
        </Fragment>
      ) : (
        <Img {...props} />
      )}
    </Fragment>
  );
};

const Img = ({
  width,
  height,
  contentUrl,
  clipPathClass,
  caption,
  copyright,
  lazyload = true,
  sizesQueries = '100vw',
  defaultSize = 30,
  alt = '',
  clickHandler,
  zoomable,
  extraClasses,
  style,
}: Props) => {
  const sizes = imageSizes(width);
  return (
    <img
      width={width}
      height={height}
      className={classNames({
        image: true,
        'bg-charcoal font-white': true,
        'lazy-image lazyload': lazyload,
        'cursor-zoom-in': Boolean(zoomable),
        [`promo__image-mask ${clipPathClass || ''}`]: clipPathClass,
        [`${extraClasses || ''}`]: Boolean(extraClasses),
      })}
      src={convertImageUri(contentUrl, defaultSize)}
      data-srcset={sizes.map(size => {
        return `${convertImageUri(contentUrl, size)} ${size}w`;
      })}
      sizes={sizesQueries}
      data-copyright={copyright}
      onClick={clickHandler}
      alt={alt || ''}
      style={style}
    />
  );
};

export default Image;
