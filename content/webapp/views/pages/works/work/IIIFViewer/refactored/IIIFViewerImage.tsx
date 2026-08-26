import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import {
  convertIiifImageUri,
  iiifThumbsUri,
} from '@weco/common/utils/convert-image-uri';
import LL from '@weco/common/views/components/styled/LL';
import { IIIFImage } from '@weco/content/services/iiif/types/image/v2';
import { convertRequestUriToInfoUri } from '@weco/content/utils/iiif/convert-iiif-uri';
async function getImageMax(url: string): Promise<number | undefined> {
  // /thumbs/ is a fixed-size derivative service with no maxWidth/access-cap
  // concept, so there's no point requesting its info.json at all
  if (url.startsWith(iiifThumbsUri)) return undefined;
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

const Image = styled.img<{
  $isHighlighted?: boolean;
  $zoomOnClick?: boolean;
  $hasLoaded: boolean;
}>`
  ${props =>
    props.$isHighlighted
      ? `filter: grayscale(100%) brightness(70%) sepia(40%) hue-rotate(-120deg) saturate(400%) contrast(1);`
      : ''}; /* the filter is used for highlighting thumbnails that contain search terms */
  cursor: ${props => (props.$zoomOnClick ? 'zoom-in' : undefined)};

  /* Hide the browser's broken-image icon/alt text while loading or retrying */
  visibility: ${props => (props.$hasLoaded ? 'visible' : 'hidden')};
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
  isRestricted?: boolean;
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
    isRestricted,
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
        $hasLoaded={hasLoaded}
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
          // Restricted items are far more likely to be failing because the
          // auth cookie is missing/no longer valid than because of a size
          // limit, so go straight to that rather than the size hack below —
          // trying both in the same error would race, since errorHandler
          // triggers a parent re-render that can overwrite whichever src
          // we set here second
          if (isRestricted) {
            errorHandler && errorHandler();
            return;
          }

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
              // Let this smaller image load (or fail) on its own terms —
              // calling errorHandler now would bump the parent's retry
              // count and overwrite this src with the original oversized
              // one before it gets a chance to load
              return;
            }
          }

          // Either there was no smaller size to try, or we already tried
          // one and it also failed — the failure may be because the
          // authorisation cookie is missing/no longer valid, so check that
          errorHandler && errorHandler();
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
