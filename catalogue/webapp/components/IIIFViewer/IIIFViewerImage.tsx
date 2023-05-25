import { forwardRef } from 'react';
import styled from 'styled-components';

const Image = styled.img<{ highlightImage?: boolean; zoomOnClick?: boolean }>`
  ${props =>
    props.highlightImage
      ? `filter: grayscale(100%) brightness(70%) sepia(40%) hue-rotate(-120deg) saturate(400%) contrast(1);`
      : ''}; /* the filter is used for highlighting thumbnails that contain search terms */
  cursor: ${props => (props.zoomOnClick ? 'zoom-in' : undefined)};
`;

type Props = {
  width: number;
  height?: number;
  src: string | undefined;
  srcSet: string | undefined;
  sizes: string | undefined;
  alt: string;
  lang?: string;
  clickHandler?: () => void | Promise<void>;
  loadHandler?: () => void | Promise<void>;
  errorHandler?: () => void | Promise<void>;
  tabIndex?: number;
  highlightImage?: boolean;
  zoomOnClick?: boolean;
};

const IIIFViewerImage = (
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
    highlightImage,
    zoomOnClick,
  }: Props,
  ref
) => {
  return (
    <Image
      zoomOnClick={zoomOnClick}
      highlightImage={highlightImage}
      ref={ref}
      tabIndex={tabIndex}
      lang={lang}
      width={width}
      height={height}
      className="image"
      onLoad={loadHandler}
      onClick={clickHandler}
      onKeyDown={({ key, keyCode }) => {
        if (key === 'Enter' || keyCode === 13) {
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

export default forwardRef(IIIFViewerImage);
