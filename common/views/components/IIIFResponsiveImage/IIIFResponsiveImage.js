// @flow
import Raven from 'raven-js';
import { classNames } from '../../../utils/classnames';

type Props = {|
  width: number,
  height?: number,
  src: string,
  srcSet: string,
  sizes: ?string,
  alt: string,
  extraClasses?: string,
  lang: ?string,
  isLazy: boolean,
  clickHandler?: () => void | Promise<void>,
  loadHandler?: () => void | Promise<void>,
  presentationOnly?: boolean,
  tabIndex?: number,
|};

const IIIFResponsiveImage = ({
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
  isLazy,
  presentationOnly,
  tabIndex,
}: Props) => {
  return (
    <>
      <img
        tabIndex={tabIndex}
        lang={lang}
        width={width}
        height={height}
        className={classNames({
          image: true,
          [extraClasses || '']: true,
          'lazy-image lazyload': isLazy,
        })}
        onLoad={loadHandler}
        onClick={clickHandler}
        onKeyDown={({ keyCode }) => {
          if (keyCode === 13) {
            clickHandler && clickHandler();
          }
        }}
        onError={event =>
          Raven.captureException(new Error('IIIF image loading error'), {
            tags: {
              service: 'dlcs',
            },
          })
        }
        src={isLazy ? undefined : src}
        data-src={isLazy ? src : undefined}
        srcSet={isLazy ? undefined : srcSet}
        data-srcset={isLazy ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        role={presentationOnly ? 'presentation' : null}
      />
    </>
  );
};

export default IIIFResponsiveImage;
