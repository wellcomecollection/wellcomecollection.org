// @flow
import Raven from 'raven-js';
import { classNames } from '../../../utils/classnames';
import { forwardRef } from 'react';
type Props = {|
  width: number,
  height?: number,
  src: ?string,
  srcSet: ?string,
  sizes: ?string,
  alt: string,
  extraClasses?: string,
  lang: ?string,
  isLazy: boolean,
  clickHandler?: () => void | Promise<void>,
  loadHandler?: () => void | Promise<void>,
  errorHandler?: () => void | Promise<void>,
  presentationOnly?: boolean,
  tabIndex?: number,
|};

// $FlowFixMe (forwardRef)
const IIIFResponsiveImage = forwardRef(
  (
    {
      width,
      height,
      src,
      srcSet,
      sizes,
      alt,
      extraClasses,
      lang,
      clickHandler,
      loadHandler,
      errorHandler,
      isLazy,
      presentationOnly,
      tabIndex,
    }: Props,
    ref // eslint-disable-line
  ) => {
    return (
      <img
        ref={ref}
        tabIndex={tabIndex}
        lang={lang}
        width={width}
        height={height}
        className={classNames({
          image: true,
          [extraClasses || '']: true,
          'lazy-image lazyload': isLazy,
        })}
        onLoad={() => {
          loadHandler && loadHandler();
        }}
        onClick={clickHandler}
        onKeyDown={({ keyCode }) => {
          if (keyCode === 13) {
            clickHandler && clickHandler();
          }
        }}
        onError={event => {
          errorHandler && errorHandler();
          Raven.captureException(new Error('IIIF image loading error'), {
            tags: {
              service: 'dlcs',
            },
          });
        }}
        src={isLazy ? undefined : src}
        data-src={isLazy ? src : undefined}
        srcSet={isLazy ? undefined : srcSet}
        data-srcset={isLazy ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        role={presentationOnly ? 'presentation' : null}
      />
    );
  }
);

IIIFResponsiveImage.displayName = 'IIIFResponsiveImage';

export default IIIFResponsiveImage;
