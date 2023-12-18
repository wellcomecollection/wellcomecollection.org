import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';

const Image = styled.img<{ $highlightImage?: boolean; $zoomOnClick?: boolean }>`
  ${props =>
    props.$highlightImage
      ? `filter: grayscale(100%) brightness(70%) sepia(40%) hue-rotate(-120deg) saturate(400%) contrast(1);`
      : ''}; /* the filter is used for highlighting thumbnails that contain search terms */
  cursor: ${props => (props.$zoomOnClick ? 'zoom-in' : undefined)};
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
  const [tryLoadingSmallerImg, setTryLoadingSmallerImg] = useState(true);
  return (
    <Image
      ref={ref}
      tabIndex={tabIndex}
      lang={lang}
      width={width}
      height={height}
      className="image"
      $zoomOnClick={zoomOnClick}
      $highlightImage={highlightImage}
      onLoad={loadHandler}
      onClick={clickHandler}
      onKeyDown={({ key, keyCode }) => {
        if (key === 'Enter' || keyCode === 13) {
          clickHandler && clickHandler();
        }
      }}
      onError={({ currentTarget }) => {
        // Hack/workaround
        // If the image fails to load it may be because of a size limit,
        // see: https://wellcome.slack.com/archives/CBT40CMKQ/p1691050149722109,
        // so first off we try a smaller image
        if (tryLoadingSmallerImg) {
          setTryLoadingSmallerImg(false); // prevent looping if image fails to load again
          const isPortrait = Boolean(height > width);
          const newSrc = isPortrait
            ? convertIiifImageUri(src, 1000, true)
            : convertIiifImageUri(src, 1000);
          currentTarget.src = newSrc;
          currentTarget.removeAttribute('srcset');
          currentTarget.removeAttribute('sizes');
        } else {
          // If the image still fails to load, we check to see if it's because the authorisation cookie is missing/no longer valid
          errorHandler && errorHandler();
        }
      }}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
    />
  );
};

export default forwardRef(IIIFViewerImage);
