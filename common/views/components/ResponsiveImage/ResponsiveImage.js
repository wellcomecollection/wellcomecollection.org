// @flow

import { useRef, useEffect } from 'react';

import { convertImageUri } from '../../../utils/convert-image-uri';
import { classNames } from '../../../utils/classnames';
import { imageSizes } from '../../../utils/image-sizes';

type Props = {
  url: string,
  width: number,
  height: ?number,
  sizesQueries: ?string,
  alt: string,
  extraClasses?: string,
};

const ResponsiveImage = ({
  url,
  width,
  height,
  sizesQueries,
  alt,
  extraClasses,
}: Props) => {
  const imgRef = useRef();

  useEffect(() => {
    imgRef.current && imgRef.current.classList.add('lazyload');
  });

  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
            <img width='${width}'
              height='${height || ''}'
              class='image image--noscript'
              src=${convertImageUri(url, 640, false)}
              alt='${alt || ''}' />`,
        }}
      />

      <img
        ref={imgRef}
        width={width}
        height={height}
        className={classNames({
          'lazy-image': true,
          lazyload: true,
          image: true,
          [extraClasses || '']: true,
        })}
        src={convertImageUri(url, 30, false)}
        data-srcset={
          sizesQueries
            ? imageSizes(width).map(size => {
                return `${convertImageUri(url, size, false)} ${size}w`;
              })
            : undefined
        }
        sizes={sizesQueries || undefined}
        alt={alt || ''}
      />
    </>
  );
};

export default ResponsiveImage;
