import { FocusTrap } from 'focus-trap-react';
import {
  CSSProperties,
  FunctionComponent,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { Transition } from 'react-transition-group';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { arrow, cross, eye } from '@weco/common/icons';
import { usePhasedFlags } from '@weco/common/server-data/Context';
import { ACTIVE_COOKIE_BANNER_ID } from '@weco/common/services/app/civic-uk';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Button from '@weco/common/views/components/Buttons';
import Icon from '@weco/common/views/components/Icon';
import LL from '@weco/common/views/components/styled/LL';
import PipeSeparated from '@weco/common/views/components/styled/PipeSeparated';
import Space from '@weco/common/views/components/styled/Space';
import useImageDetails from '@weco/content/hooks/useImageDetails';
import { readUrlHash } from '@weco/content/hooks/useUrlHash';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { removeDisplayMarkupTags } from '@weco/content/utils/string';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import VisuallySimilarImagesFromApi from '@weco/content/views/components/VisuallySimilarImages';
import { phaseIsAtLeast } from '@weco/toggles';

import ImageSidebarResizeHandle, {
  COLUMNS_PROPERTY,
} from './ImageSidebar.ResizeHandle';
import {
  CloseButton,
  LoadingWrapper,
  MetadataWrapper,
  SIDEBAR_COLUMNS,
  SidebarHeader,
  SidebarScroller,
  SidebarWrapper,
  StepButton,
  StepButtons,
  ThumbnailLink,
  ThumbnailPanel,
  Title,
} from './ImageSidebar.styles';

// How long after an image is chosen the browser may still focus its thumbnail
const THUMBNAIL_FOCUS_WINDOW_MS = 500;

export type SidebarStatus = 'closed' | 'opening' | 'open' | 'closing';

/**
 * The element's computed transition duration in milliseconds, which is 0 when
 * it has no transition (e.g. with reduced motion).
 */
const getTransitionMs = (element: HTMLElement): number => {
  const duration = getComputedStyle(element).transitionDuration;
  return (parseFloat(duration) || 0) * (duration.endsWith('ms') ? 1 : 1000);
};

type Props = {
  images: Image[];
  expandedImage?: Image;
  setExpandedImage: (image: Image | undefined) => void;
  // As it slides in and out, for laying out what's beside it
  onStatusChange?: (status: SidebarStatus) => void;
  // Without one, that button is disabled
  onPrevious?: StepHandler;
  onNext?: StepHandler;
};

// Calls `beforeStep` only once the step is definitely happening, which may be
// after another page of results has loaded, or never
export type StepHandler = (beforeStep: () => void) => void;

// Below `sm`, the sidebar covers the page
export const useIsSidebarFullScreen = (): boolean =>
  useAppContext().windowSize === 'zero';

/**
 * Moves focus to the close button each time an image is chosen, as choosing an
 * image is asking for its details. Stepping to the previous or next image
 * leaves focus on the button that was used, so it can be pressed again.
 *
 * Returns a function to call once the person starts moving focus themselves,
 * so it's left alone from then on, and one to call with the step button used.
 */
const useFocusCloseButtonOnSelect = (
  imageId: string | undefined,
  closeButtonRef: RefObject<HTMLElement | null>
) => {
  const hasTakenOver = useRef(false);
  const steppedFrom = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!imageId) return;

    hasTakenOver.current = false;
    const stepButton = steppedFrom.current;
    steppedFrom.current = null;

    const focusTarget = () => {
      // Leave focus alone if the cookie banner is showing, as the modal does
      if (document.getElementById(ACTIVE_COOKIE_BANNER_ID)) return;

      // Without scrolling, as it may still be off screen, sliding in
      (stepButton ?? closeButtonRef.current)?.focus({ preventScroll: true });
    };

    // Setting the image id as the URL hash can make the browser focus the
    // thumbnail with that id a moment later, after the timeout below has moved
    // focus. So if the thumbnail is focused shortly after, move focus back into
    // the sidebar. It's watched for on the document, as the grid laying out
    // again can remount the thumbnail.
    const onFocusIn = (event: FocusEvent) => {
      if (hasTakenOver.current) return;

      if ((event.target as HTMLElement).id === imageId) focusTarget();
    };
    const stopWatching = () =>
      document.removeEventListener('focusin', onFocusIn);

    document.addEventListener('focusin', onFocusIn);

    const timeouts = [
      ...(stepButton ? [] : [setTimeout(focusTarget)]),
      setTimeout(stopWatching, THUMBNAIL_FOCUS_WINDOW_MS),
    ];

    return () => {
      timeouts.forEach(clearTimeout);
      stopWatching();
    };
  }, [imageId]);

  return {
    stopRefocusing: () => {
      hasTakenOver.current = true;
    },
    setSteppedFrom: (button: HTMLElement) => {
      steppedFrom.current = button;
    },
  };
};

/**
 * Shows the details of the selected image result next to the results grid.
 * Renders nothing until an image is selected, then slides in, and keeps the
 * last image while it slides out. An image that was in the URL when the page
 * loaded just appears. Choosing another image while it's open swaps the
 * content in place. Focus moves to the close button each time an image is
 * chosen.
 */
const ImageSidebar: FunctionComponent<Props> = ({
  images,
  expandedImage,
  setExpandedImage,
  onStatusChange,
  onPrevious,
  onNext,
}) => {
  // A button, rendered with `as` from a styled div
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const sidebarId = useId();
  const isFullScreen = useIsSidebarFullScreen();
  const isOpen = expandedImage !== undefined;
  const { imageSidebarPhases } = usePhasedFlags();
  const showImageSidebarPhase2 = phaseIsAtLeast(imageSidebarPhases, 'phase2');
  const showImageSidebarPhase3 = phaseIsAtLeast(imageSidebarPhases, 'phase3');
  const hasResizeHandle = showImageSidebarPhase2 && !isFullScreen;
  const hasHeaderStepButtons = showImageSidebarPhase3 && !isFullScreen;

  const linkedImageId = useRef(
    typeof window === 'undefined' ? undefined : readUrlHash()
  );
  const [isInstant, setIsInstant] = useState(false);

  // Kept while other images are chosen, and back to the default once it closes
  const [columns, setColumns] = useState(SIDEBAR_COLUMNS.default);

  // The expanded image, or the last one while the sidebar slides out
  const [shownImage, setShownImage] = useState<Image | undefined>();
  if (expandedImage && expandedImage !== shownImage) {
    setShownImage(expandedImage);
    if (!shownImage) {
      setIsInstant(expandedImage.id === linkedImageId.current);
    }
  }

  const isAnnouncingStep = useRef(false);
  const { stopRefocusing, setSteppedFrom } = useFocusCloseButtonOnSelect(
    expandedImage?.id,
    closeButtonRef
  );

  const stepButton = ({
    label,
    shortLabel,
    icon,
    onStep,
    gtmTrigger,
    ref,
  }: {
    ref?: RefObject<HTMLButtonElement | null>;
    label: string;
    shortLabel: string;
    icon: ReactNode;
    onStep?: StepHandler;
    gtmTrigger: string;
  }) => (
    <StepButton
      ref={ref}
      {...dataGtmPropsToAttributes({ trigger: gtmTrigger })}
      aria-label={label}
      aria-disabled={!onStep}
      onClick={event => {
        if (!onStep) return;
        const button = event.currentTarget;
        onStep(() => {
          setSteppedFrom(button);
          isAnnouncingStep.current = true;
        });
      }}
    >
      {icon}
      {shortLabel}
    </StepButton>
  );

  useEffect(() => {
    if (expandedImage && scrollerRef.current) scrollerRef.current.scrollTop = 0;
  }, [expandedImage?.id]);

  const {
    detailedWork,
    iiifImageLocation,
    license,
    expandedImageLink,
    productionDates,
    displayContributor,
    displayTitle,
  } = useImageDetails(images, shownImage);

  // Focus stays on the step button, so nothing else tells a screen reader
  // that the image changed
  const [stepAnnouncement, setStepAnnouncement] = useState('');
  useEffect(() => {
    if (!isAnnouncingStep.current || !detailedWork) return;

    isAnnouncingStep.current = false;
    setStepAnnouncement(
      removeDisplayMarkupTags(displayTitle) || 'Untitled image'
    );
  }, [shownImage?.id, detailedWork]);

  const addEndListener = (done: () => void) => {
    const sidebar = sidebarRef.current;
    const ms = sidebar ? getTransitionMs(sidebar) : 0;
    if (!sidebar || ms === 0) {
      setTimeout(done);
      return;
    }

    // When the slide ends, or a little after it should have, in case the
    // browser never says so. Transition ignores the second call.
    const listening = new AbortController();
    const finish = () => {
      listening.abort();
      done();
    };
    sidebar.addEventListener(
      'transitionend',
      event => {
        if (event.target === sidebar) finish();
      },
      { signal: listening.signal }
    );
    setTimeout(finish, ms + 100);
  };

  // Shift+Tab from the first thing in the sidebar goes to the selected
  // thumbnail rather than the end of the results
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;

    stopRefocusing();

    const first = hasResizeHandle
      ? resizeHandleRef
      : hasHeaderStepButtons
        ? previousButtonRef
        : closeButtonRef;
    const isLeavingBackwards = event.shiftKey && event.target === first.current;
    if (!isLeavingBackwards || isFullScreen || !expandedImage) return;

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
    <Transition
      in={isOpen}
      nodeRef={sidebarRef}
      addEndListener={addEndListener}
      onEnter={() => {
        linkedImageId.current = undefined;
        onStatusChange?.('opening');
      }}
      onEntered={() => onStatusChange?.('open')}
      onExit={() => {
        setIsInstant(false);
        onStatusChange?.('closing');
      }}
      onExited={() => {
        setShownImage(undefined);
        setColumns(SIDEBAR_COLUMNS.default);
        onStatusChange?.('closed');
      }}
      mountOnEnter
      unmountOnExit
    >
      {state => (
        <FocusTrap
          active={isFullScreen && isOpen}
          focusTrapOptions={{
            returnFocusOnDeactivate: false,
            initialFocus: false,
            preventScroll: true,
          }}
        >
          <SidebarWrapper
            ref={sidebarRef}
            id={sidebarId}
            style={{ [COLUMNS_PROPERTY]: columns } as CSSProperties}
            data-component="image-sidebar"
            aria-label="Image details"
            data-lock-scroll={isFullScreen && state !== 'exited'}
            inert={!isOpen}
            onKeyDown={handleKeyDown}
            $isOpen={state === 'entering' || state === 'entered'}
            $isInstant={isInstant}
          >
            {hasResizeHandle && (
              <ImageSidebarResizeHandle
                ref={resizeHandleRef}
                sidebarRef={sidebarRef}
                sidebarId={sidebarId}
                columns={columns}
                setColumns={setColumns}
              />
            )}
            <div className="visually-hidden" aria-live="polite">
              {stepAnnouncement}
            </div>
            <SidebarScroller ref={scrollerRef}>
              <SidebarHeader>
                {hasHeaderStepButtons && (
                  <StepButtons>
                    {stepButton({
                      ref: previousButtonRef,
                      label: 'Previous image',
                      shortLabel: 'Prev',
                      icon: <Icon icon={arrow} rotate={180} />,
                      onStep: onPrevious,
                      gtmTrigger: 'image_sidebar_previous',
                    })}
                    {stepButton({
                      label: 'Next image',
                      shortLabel: 'Next',
                      icon: <Icon icon={arrow} />,
                      onStep: onNext,
                      gtmTrigger: 'image_sidebar_next',
                    })}
                  </StepButtons>
                )}
                <CloseButton
                  {...dataGtmPropsToAttributes({
                    trigger: 'close-modal-button',
                  })}
                  ref={closeButtonRef}
                  onClick={() => setExpandedImage(undefined)}
                  $hasLabel={showImageSidebarPhase3}
                >
                  <Icon icon={cross} />
                  {showImageSidebarPhase3 ? (
                    <span>
                      Close
                      <span className="visually-hidden"> image details</span>
                    </span>
                  ) : (
                    <span className="visually-hidden">Close image details</span>
                  )}
                </CloseButton>
              </SidebarHeader>

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
                        <Title
                          dangerouslySetInnerHTML={{ __html: displayTitle }}
                        />
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
                        hierarchy="primary"
                        text="View image"
                        icon={eye}
                        link={expandedImageLink}
                        ariaLabel="View expanded image"
                      />
                    </Space>
                  )}

                  {shownImage && (
                    <VisuallySimilarImagesFromApi
                      originalId={shownImage.id}
                      onClickImage={setExpandedImage}
                      variant="sidebar"
                    />
                  )}
                </>
              )}
            </SidebarScroller>
          </SidebarWrapper>
        </FocusTrap>
      )}
    </Transition>
  );
};

export default ImageSidebar;
