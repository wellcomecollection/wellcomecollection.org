import { classNames } from '@weco/common/utils/classnames';
import { forwardRef } from 'react';
import styled from 'styled-components';

const Image = styled.img<{ filterId?: string | null }>`
  ${props =>
    props.filterId
      ? `filter: url(#${props.filterId})`
      : ''}; // the filter is used for highlighting thumbnails that contain search terms
`;

type Props = {
  width: number;
  height?: number;
  src: string | undefined;
  srcSet: string | undefined;
  sizes: string | undefined;
  alt: string;
  lang: string | undefined;
  clickHandler?: () => void | Promise<void>;
  loadHandler?: () => void | Promise<void>;
  errorHandler?: () => void | Promise<void>;
  tabIndex?: number;
  filterId?: string | null;
};

const IIIFImage = (
  {
    width,
    height,
    src,
    srcSet,
    sizes,
    alt,
    lang,
    clickHandler,
    loadHandler,
    errorHandler,
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
      }}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
    />
  );
};

export default forwardRef(IIIFImage);
