import { FocusTrap } from 'focus-trap-react';
import {
  CSSProperties,
  FunctionComponent,
  KeyboardEvent,
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
  StepBar,
  StepButton,
  StepButtons,
  ThumbnailLink,
  ThumbnailPanel,
  Title,
} from './ImageSidebar.styles';
import useFocusCloseButtonOnSelect from './useFocusCloseButtonOnSelect';

// Lets focus move first, so a screen reader doesn't drop the announcement
const ANNOUNCEMENT_DELAY_MS = 150;

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
  // The browser's Back or Forward moved between images, treated as a step
  isFromUrlChange?: boolean;
  setExpandedImage: (image: Image | undefined) => void;
  // As it slides in and out, for laying out what's beside it
  onStatusChange?: (status: SidebarStatus) => void;
  // Without one, that button is disabled
  onPrevious?: StepHandler;
  onNext?: StepHandler;
  // Arrow keys pressed in here step through the images too, not just ones
  // pressed in the sidebar (e.g. the results grid)
  arrowKeysAreaRef?: RefObject<HTMLElement | null>;
};

type StepDirection = 'previous' | 'next';

// Calls `beforeStep` only once the step is definitely happening, which may be
// after another page of results has loaded, or never
export type StepHandler = (beforeStep: () => void) => void;

// Text fields, selects and the like use the arrow keys themselves
const usesArrowKeys = (element: Element): boolean =>
  element instanceof HTMLElement &&
  (element.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName));

// Below `sm`, the sidebar covers the page
export const useIsSidebarFullScreen = (): boolean =>
  useAppContext().windowSize === 'zero';

/**
 * Shows the details of the selected image result next to the results grid.
 * Renders only its screen reader announcement until an image is selected, then
 * slides in, and keeps the last image while it slides out. An image that was in the URL when the page
 * loaded just appears. Choosing another image while it's open swaps the
 * content in place. Focus moves to the close button each time an image is
 * chosen.
 */
const ImageSidebar: FunctionComponent<Props> = ({
  images,
  expandedImage,
  isFromUrlChange = false,
  setExpandedImage,
  onStatusChange,
  onPrevious,
  onNext,
  arrowKeysAreaRef,
}) => {
  // A button, rendered with `as` from a styled div
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
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
  const hasStepBar = showImageSidebarPhase3 && isFullScreen;

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

  // Not for picked thumbnails, whose title was just heard
  const isAnnouncingStep = useRef(false);
  const { stopRefocusing, setSteppedFrom } = useFocusCloseButtonOnSelect(
    expandedImage?.id,
    isFromUrlChange,
    closeButtonRef
  );

  const steps = {
    previous: {
      label: 'Previous image',
      shortLabel: 'Prev',
      icon: <Icon icon={arrow} rotate={180} />,
      buttonRef: previousButtonRef,
      onStep: onPrevious,
    },
    next: {
      label: 'Next image',
      shortLabel: 'Next',
      icon: <Icon icon={arrow} />,
      buttonRef: nextButtonRef,
      onStep: onNext,
    },
  };

  // Leaves focus on `focused` (see useFocusCloseButtonOnSelect), and
  // announces the image once it's stepped to
  const step = (direction: StepDirection, focused: HTMLElement) => {
    const { onStep, buttonRef } = steps[direction];

    onStep?.(() => {
      setSteppedFrom(focused, buttonRef.current);
      isAnnouncingStep.current = true;
    });
  };

  // The arrow keys step by clicking the buttons, so they use the current
  // step handlers rather than the ones from when the listener was added. This
  // is what had focus when the key was pressed.
  const arrowKeyFocus = useRef<HTMLElement | null>(null);

  const stepButton = (direction: StepDirection) => {
    const { label, shortLabel, icon, buttonRef, onStep } = steps[direction];

    return (
      <StepButton
        ref={buttonRef}
        aria-label={label}
        aria-disabled={!onStep}
        onClick={event => {
          const focused = arrowKeyFocus.current ?? event.currentTarget;
          arrowKeyFocus.current = null;
          step(direction, focused);
        }}
      >
        {icon}
        {shortLabel}
      </StepButton>
    );
  };

  // Rendered in one place or the other, never both: the header has room for
  // them until the sidebar fills the screen, where they move to the bottom bar
  const stepButtons = (
    <>
      {stepButton('previous')}
      {stepButton('next')}
    </>
  );

  // Modifiers are left alone, as Alt+ArrowLeft is the browser's Back; the
  // resize handle's onKeyDown runs first and preventDefaults, stopping a step
  useEffect(() => {
    if (!isOpen || !hasHeaderStepButtons) return;

    const stepOnArrowKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target as Element;
      const isInArea =
        target === document.body ||
        sidebarRef.current?.contains(target) ||
        arrowKeysAreaRef?.current?.contains(target);
      if (!isInArea || usesArrowKeys(target)) return;

      // Swallowed at either end too, so the page doesn't scroll instead
      event.preventDefault();

      // Not clicked at either end, as no image is stepped to
      const button =
        event.key === 'ArrowLeft'
          ? previousButtonRef.current
          : nextButtonRef.current;
      if (!button || button.getAttribute('aria-disabled') === 'true') return;

      arrowKeyFocus.current = target as HTMLElement;
      button.click();
    };
    document.addEventListener('keydown', stepOnArrowKey);
    return () => document.removeEventListener('keydown', stepOnArrowKey);
  }, [isOpen, hasHeaderStepButtons]);

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

  // Focus stays put on a step, so this is what tells a screen reader the image
  // changed. Cleared first, so the same title twice is still spoken.
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const isAnnouncing = isAnnouncingStep.current || isFromUrlChange;
    isAnnouncingStep.current = false;

    // Cleared on a pick too, so the last title isn't left for the virtual
    // cursor to find
    setAnnouncement('');
    if (!expandedImage || !isAnnouncing) return;

    const timeout = setTimeout(
      () =>
        setAnnouncement(
          removeDisplayMarkupTags(expandedImage.source.title) ||
            'Untitled image'
        ),
      ANNOUNCEMENT_DELAY_MS
    );
    return () => clearTimeout(timeout);
  }, [expandedImage?.id]);

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
    <>
      {/* Outside the sidebar, so it's never replaced as that comes and goes */}
      <div
        className="visually-hidden"
        role="status"
        data-testid="image-sidebar-announcement"
      >
        {announcement}
      </div>
      {/* Full screen below `sm`, so focus stays inside it and the page doesn't
      scroll behind it. This uses the window's width, not a media query:
      locking hides the page scrollbar, which can change the width a media
      query sees and flip the layout back and forth. */}
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
              <SidebarScroller ref={scrollerRef}>
                <SidebarHeader>
                  {hasHeaderStepButtons && (
                    <StepButtons>{stepButtons}</StepButtons>
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
                      <span className="visually-hidden">
                        Close image details
                      </span>
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
                              <PipeSeparated>
                                {displayContributor}
                              </PipeSeparated>
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

              {hasStepBar && <StepBar>{stepButtons}</StepBar>}
            </SidebarWrapper>
          </FocusTrap>
        )}
      </Transition>
    </>
  );
};

export default ImageSidebar;
