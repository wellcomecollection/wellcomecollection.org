import Raven from 'raven-js';
import { classNames } from '../../../utils/classnames';
import { forwardRef } from 'react';
import styled from 'styled-components';

const Image = styled.img<{ filterId?: string | null }>`
  ${props => (props.filterId ? `filter: url(#${props.filterId})` : '')};
`;

type Props = {
  width: number;
  height?: number;
  src: string | undefined;
  srcSet: string | undefined;
  sizes: string | undefined;
  alt: string;
  extraClasses?: string;
  lang: string | undefined;
  isLazy: boolean;
  clickHandler?: () => void | Promise<void>;
  loadHandler?: () => void | Promise<void>;
  errorHandler?: () => void | Promise<void>;
  presentationOnly?: boolean;
  tabIndex?: number;
  filterId?: string | null;
};

const IIIFResponsiveImage = (
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
    filterId,
  }: Props,
ref // eslint-disable-line
) => {
  return (
    <Image
      filterId={filterId}
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
      onError={() => {
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
      role={presentationOnly ? 'presentation' : undefined}
    />
  );
};

export default forwardRef(IIIFResponsiveImage);
