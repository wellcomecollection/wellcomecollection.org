// @flow
import type { Tasl } from '../../../model/tasl';
import { classNames } from '../../../utils/classnames';
import { convertImageUri } from '../../../utils/convert-image-uri';
import { imageSizes, supportedSizes } from '../../../utils/image-sizes';
import type { ImageType } from '../../../model/image';

export type Props = {|
  contentUrl: string,
  width?: number,
  alt: string,
  tasl: ?Tasl,
  height?: number,
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
  srcsetRequired?: boolean,
|};

const Image = (props: Props) => {
  const classes = classNames({
    'image image--noscript bg-charcoal font-white': true,
    [`${props.extraClasses || ''}`]: Boolean(props.extraClasses),
  });
  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
      <img width='${props.width || ''}'
        height='${props.height || ''}'
        class='${classes}'
        src='${convertImageUri(props.contentUrl, 640)}'
        alt='${props.alt || ''}' />`,
        }}
      />
      <Img {...props} />
    </>
  );
};

const Img = ({
  width,
  height,
  contentUrl,
  copyright,
  lazyload = true,
  sizesQueries = '100vw',
  defaultSize = 30,
  alt = '',
  clickHandler,
  zoomable,
  extraClasses,
  style,
  srcsetRequired = true,
}: Props) => {
  const sizes = width !== undefined ? imageSizes(width) : supportedSizes;
  return (
    <img
      width={width}
      height={height}
      className={classNames({
        image: true,
        'bg-charcoal font-white': true,
        'lazy-image lazyload': lazyload,
        'cursor-zoom-in': Boolean(zoomable),
        [`${extraClasses || ''}`]: Boolean(extraClasses),
      })}
      src={convertImageUri(contentUrl, defaultSize)}
      data-srcset={
        srcsetRequired
          ? sizes.map(size => {
              return `${convertImageUri(contentUrl, size)} ${size}w`;
            })
          : null
      }
      sizes={srcsetRequired ? sizesQueries : null}
      data-copyright={copyright}
      onClick={clickHandler}
      alt={alt || ''}
      style={style}
    />
  );
};

export default Image;
