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
  clickHandler?: () => void,
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
  isLazy,
}: Props) => {
  return (
    <img
      lang={lang}
      width={width}
      height={height}
      className={classNames({
        image: true,
        [extraClasses || '']: true,
        'lazy-image lazyload': isLazy,
      })}
      onClick={clickHandler}
      onError={event =>
        Raven.captureException(new Error('IIIF image loading error'), {
          tags: {
            service: 'dlcs',
          },
        })
      }
      src={src}
      srcSet={isLazy ? undefined : srcSet}
      data-srcSet={isLazy ? srcSet : undefined}
      sizes={sizes}
      alt={alt}
    />
  );
};

export default IIIFResponsiveImage;
