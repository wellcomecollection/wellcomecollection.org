import { FocusTrap } from 'focus-trap-react';
import {
  Dispatch,
  FunctionComponent,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { cross, eye } from '@weco/common/icons';
import { ACTIVE_COOKIE_BANNER_ID } from '@weco/common/services/app/civic-uk';
import Button from '@weco/common/views/components/Buttons';
import Icon from '@weco/common/views/components/Icon';
import LL from '@weco/common/views/components/styled/LL';
import PipeSeparated from '@weco/common/views/components/styled/PipeSeparated';
import Space from '@weco/common/views/components/styled/Space';
import useImageDetails from '@weco/content/hooks/useImageDetails';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { removeDisplayMarkupTags } from '@weco/content/utils/string';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import VisuallySimilarImagesFromApi from '@weco/content/views/components/VisuallySimilarImages';

import {
  CloseButton,
  LoadingWrapper,
  MetadataWrapper,
  SidebarWrapper,
  ThumbnailLink,
  ThumbnailPanel,
  Title,
} from './ImageSidebar.styles';

// How long after an image is chosen the browser may still focus its thumbnail
const THUMBNAIL_FOCUS_WINDOW_MS = 500;

type Props = {
  images: Image[];
  expandedImage?: Image;
  setExpandedImage: Dispatch<SetStateAction<Image | undefined>>;
};

/**
 * Moves focus to the close button each time an image is chosen, not only when
 * the sidebar opens, as choosing an image is asking for its details. The same
 * image staying open (e.g. across pages of results) doesn't count.
 *
 * Returns a function to call once the person starts moving focus themselves,
 * so it's left alone from then on.
 */
const useFocusCloseButtonOnSelect = (
  imageId: string | undefined,
  closeButtonRef: RefObject<HTMLElement | null>
) => {
  const hasTakenOver = useRef(false);

  useEffect(() => {
    if (!imageId) return;

    hasTakenOver.current = false;

    const focusCloseButton = () => {
      // Leave focus alone if the cookie banner is showing, as the modal does
      if (document.getElementById(ACTIVE_COOKIE_BANNER_ID)) return;

      closeButtonRef.current?.focus();
    };

    // Setting the image id as the URL hash can make the browser focus the
    // thumbnail with that id a moment later, after the timeout below has moved
    // focus. So if the thumbnail is focused shortly after, move focus back into
    // the sidebar. It's watched for on the document, as the grid laying out
    // again can remount the thumbnail.
    const onFocusIn = (event: FocusEvent) => {
      if (hasTakenOver.current) return;

      if ((event.target as HTMLElement).id === imageId) focusCloseButton();
    };
    const stopWatching = () =>
      document.removeEventListener('focusin', onFocusIn);

    document.addEventListener('focusin', onFocusIn);

    const timeouts = [
      setTimeout(focusCloseButton),
      setTimeout(stopWatching, THUMBNAIL_FOCUS_WINDOW_MS),
    ];

    return () => {
      timeouts.forEach(clearTimeout);
      stopWatching();
    };
  }, [imageId]);

  return () => {
    hasTakenOver.current = true;
  };
};

/**
 * Shows the details of the selected image result next to the results grid.
 * Renders nothing until an image is selected. Focus moves to the close button
 * each time an image is chosen.
 */
const ImageSidebar: FunctionComponent<Props> = ({
  images,
  expandedImage,
  setExpandedImage,
}) => {
  // A button, rendered with `as` from a styled div
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const { windowSize } = useAppContext();
  const isFullScreen = windowSize === 'zero';

  const stopRefocusing = useFocusCloseButtonOnSelect(
    expandedImage?.id,
    closeButtonRef
  );

  const {
    detailedWork,
    iiifImageLocation,
    license,
    expandedImageLink,
    productionDates,
    displayContributor,
    displayTitle,
  } = useImageDetails(images, expandedImage);

  if (!expandedImage) return null;

  // Shift+Tab from the close button, the first thing in the sidebar, goes to
  // the selected thumbnail rather than the end of the results. Full screen, the
  // results are hidden and focus stays in the sidebar, so it's left alone.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;

    stopRefocusing();

    const isLeavingBackwards =
      event.shiftKey && event.target === closeButtonRef.current;
    if (!isLeavingBackwards || isFullScreen) return;

    // The id is checked against the results as well as the page, as an
    // element elsewhere could share it
    const isInResults = images.some(({ id }) => id === expandedImage.id);
    const thumbnail = isInResults
      ? document.getElementById(expandedImage.id)
      : null;

    if (thumbnail) {
      event.preventDefault();
      thumbnail.focus();
    }
  };

  return (
    // Full screen below `sm`, so focus stays inside it and the page doesn't
    // scroll behind it. This uses the window's width, not a media query:
    // locking hides the page scrollbar, which can change the width a media
    // query sees and flip the layout back and forth.
    <FocusTrap
      active={isFullScreen}
      focusTrapOptions={{
        returnFocusOnDeactivate: false,
        initialFocus: false,
        preventScroll: true,
      }}
    >
      <SidebarWrapper
        as="section"
        data-component="image-sidebar"
        aria-label="Image details"
        data-lock-scroll={isFullScreen}
        onKeyDown={handleKeyDown}
      >
        <CloseButton
          ref={closeButtonRef}
          onClick={() => setExpandedImage(undefined)}
        >
          <span className="visually-hidden">Close image details</span>
          <Icon icon={cross} />
        </CloseButton>

        {!detailedWork ? (
          <LoadingWrapper>
            <LL />
          </LoadingWrapper>
        ) : (
          <>
            {iiifImageLocation && expandedImageLink && (
              <ThumbnailPanel>
                <ThumbnailLink
                  {...expandedImageLink}
                  aria-label={
                    displayTitle
                      ? `View image: ${removeDisplayMarkupTags(displayTitle)}`
                      : 'View image'
                  }
                >
                  <IIIFImage
                    layout="raw"
                    image={{
                      contentUrl: iiifImageLocation.url,
                      width: 400,
                      height: 400,
                      alt: '',
                    }}
                    width={400}
                  />
                </ThumbnailLink>
              </ThumbnailPanel>
            )}

            {(displayTitle || displayContributor || license) && (
              <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
                {displayTitle && (
                  <Title dangerouslySetInnerHTML={{ __html: displayTitle }} />
                )}

                {(displayContributor || productionDates.length > 0) && (
                  <MetadataWrapper>
                    {displayContributor && (
                      <PipeSeparated>{displayContributor}</PipeSeparated>
                    )}
                    {productionDates.length > 0 && (
                      <PipeSeparated>
                        Date:&nbsp;{productionDates[0]}
                      </PipeSeparated>
                    )}
                  </MetadataWrapper>
                )}

                {license && (
                  <MetadataWrapper>
                    Licence:&nbsp;
                    {license.url && (
                      <a rel="license" href={license.url}>
                        {license.label}
                      </a>
                    )}
                    {!license.url && license.label}
                  </MetadataWrapper>
                )}
              </Space>
            )}

            {expandedImageLink && (
              <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
                <Button
                  variant="ButtonSolidLink"
                  text="View image"
                  icon={eye}
                  link={expandedImageLink}
                  ariaLabel="View expanded image"
                />
              </Space>
            )}

            <VisuallySimilarImagesFromApi
              originalId={expandedImage.id}
              onClickImage={setExpandedImage}
              variant="sidebar"
            />
          </>
        )}
      </SidebarWrapper>
    </FocusTrap>
  );
};

export default ImageSidebar;
