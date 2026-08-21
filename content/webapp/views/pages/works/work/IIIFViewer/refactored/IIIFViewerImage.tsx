import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LL from '@weco/common/views/components/styled/LL';
import { IIIFImage } from '@weco/content/services/iiif/types/image/v2';
import { convertRequestUriToInfoUri } from '@weco/content/utils/iiif/convert-iiif-uri';
async function getImageMax(url: string): Promise<number | undefined> {
  const infoUrl = convertRequestUriToInfoUri(url);
  if (!infoUrl) return undefined;
  try {
    const resp = await fetch(infoUrl);
    const info: Partial<IIIFImage> = await resp.json();
    // N.B property is called maxWidth, but it is actually the max allowed for the longest side, see https://wellcome.slack.com/archives/CBT40CMKQ/p1702897884100559
    return info.profile?.find(
      (item): item is { maxWidth: number } =>
        typeof item !== 'string' && Boolean(item.maxWidth)
    )?.maxWidth;
  } catch {
    return undefined;
  }
}

const Image = styled.img<{ $isHighlighted?: boolean; $zoomOnClick?: boolean }>`
  ${props =>
    props.$isHighlighted
      ? `filter: grayscale(100%) brightness(70%) sepia(40%) hue-rotate(-120deg) saturate(400%) contrast(1);`
      : ''}; /* the filter is used for highlighting thumbnails that contain search terms */
  cursor: ${props => (props.$zoomOnClick ? 'zoom-in' : undefined)};
`;

type Props = {
  index?: number;
  width: number;
  height?: number;
  src: string | undefined;
  srcSet: string | undefined;
  sizes: string | undefined;
  alt: string;
  ariaDescribedBy?: string;
  lang?: string;
  clickHandler?: () => void | Promise<void>;
  loadHandler?: () => void | Promise<void>;
  errorHandler?: () => void | Promise<void>;
  tabIndex?: number;
  isHighlighted?: boolean;
  zoomOnClick?: boolean;
};

const IIIFViewerImage = (
  {
    index,
    width,
    height,
    src,
    srcSet,
    sizes,
    alt,
    ariaDescribedBy,
    lang,
    clickHandler,
    loadHandler,
    errorHandler,
    tabIndex,
    isHighlighted,
    zoomOnClick,
  }: Props,
  ref: ForwardedRef<HTMLImageElement>
) => {
  const { isFullSupportBrowser } = useAppContext();
  const [tryLoadingSmallerImg, setTryLoadingSmallerImg] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Reset tryLoadingSmallerImg when src changes so each new image
  // gets a chance to try the smaller size conversion if it errors
  useEffect(() => {
    setTryLoadingSmallerImg(true);
    setHasLoaded(false);
  }, [src]);

  return (
    <>
      {!hasLoaded && isFullSupportBrowser && <LL $lighten />}
      <Image
        data-testid={index !== undefined ? `image-${index}` : null}
        ref={ref}
        tabIndex={tabIndex}
        lang={lang}
        aria-describedby={ariaDescribedBy}
        width={width}
        height={height}
        className="image"
        $zoomOnClick={zoomOnClick}
        $isHighlighted={isHighlighted}
        onLoad={() => {
          loadHandler && loadHandler();
          setHasLoaded(true);
        }}
        onClick={clickHandler}
        onKeyDown={({ key, keyCode }) => {
          if (key === 'Enter' || keyCode === 13) {
            clickHandler && clickHandler();
          }
        }}
        onError={async ({ currentTarget }) => {
          // Hack/workaround
          // If the image fails to load it may be because of a size limit,
          // see: https://wellcome.slack.com/archives/CBT40CMKQ/p1691050149722109,
          // so first off we try a smaller image
          if (tryLoadingSmallerImg) {
            setTryLoadingSmallerImg(false); // prevent looping if image fails to load again
            // we need to know the max size of the longest side first
            const imageMax = await getImageMax(currentTarget.src);
            if (imageMax) {
              const isPortrait = Boolean(height && height > width);
              const newSrc = isPortrait
                ? convertIiifImageUri(currentTarget.src, imageMax, true)
                : convertIiifImageUri(currentTarget.src, imageMax);
              currentTarget.src = newSrc;
              currentTarget.removeAttribute('srcset');
              currentTarget.removeAttribute('sizes');
            } else {
              errorHandler && errorHandler();
            }
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
    </>
  );
};

export default forwardRef(IIIFViewerImage);
