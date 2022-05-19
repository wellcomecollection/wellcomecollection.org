import { classNames } from '../../../utils/classnames';
import { convertPrismicImageUri } from '../../../utils/convert-image-uri';
import { imageSizes, supportedSizes } from '../../../utils/image-sizes';
import { isNotUndefined } from '../../../utils/array';
import { FunctionComponent } from 'react';

export type Props = {
  contentUrl: string;
  width?: number;
  height?: number;
  alt: string | null;
  lazyload?: boolean;
  sizesQueries?: string;
  copyright?: string;
  defaultSize?: number;
  clickHandler?: () => void;
  zoomable?: boolean;
  extraClasses?: string;
  style?: Record<string, string>;
  srcsetRequired?: boolean;
};

const Img = ({
  width,
  height,
  alt = '',
  contentUrl,
  lazyload = true,
  sizesQueries = '100vw',
  copyright,
  defaultSize = 30,
  clickHandler,
  zoomable,
  extraClasses,
  style,
  srcsetRequired = true,
}: Props) => {
  const sizes = isNotUndefined(width) ? imageSizes(width) : supportedSizes;
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
      src={convertPrismicImageUri(contentUrl, defaultSize)}
      data-srcset={
        srcsetRequired
          ? sizes.map(size => {
              return `${convertPrismicImageUri(contentUrl, size)} ${size}w`;
            })
          : undefined
      }
      sizes={srcsetRequired ? sizesQueries : undefined}
      data-copyright={copyright}
      onClick={clickHandler}
      alt={alt || ''}
      style={style}
    />
  );
};

const Image: FunctionComponent<Props> = (props: Props) => {
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
        src='${convertPrismicImageUri(props.contentUrl, 640)}'
        alt='${props.alt || ''}' />`,
        }}
      />
      <Img {...props} />
    </>
  );
};

export default Image;
