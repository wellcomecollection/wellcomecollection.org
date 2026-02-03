import { FocusTrap } from 'focus-trap-react';
import {
  Fragment,
  FunctionComponent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import { cross } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import { Link } from '@weco/content/types/link';

import {
  AnimatedTextContainer,
  BackgroundOverlay,
  InPageNavAnimatedLink,
  InPageNavList,
  ListItem,
  MobileNavButton,
  NavGridCell,
  Root,
} from './InPageNavigation.Sticky.styles';

export type Props = {
  links: Link[];
  sizeMap: SizeMap;
  isOnWhite?: boolean;
};

const InPageNavigationSticky: FunctionComponent<Props> = ({
  links,
  isOnWhite,
  sizeMap,
}) => {
  // Extract ids from links (strip leading #)
  const ids = links.map(link => link.url.replace('#', ''));

  // Use a rootMargin to account for the sticky nav height
  // This ensures sections are only considered "active" when they're below the sticky nav
  const rootMargin = '-60px 0px 0px 0px';
  const observedActiveId = useActiveAnchor(ids, rootMargin);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const InPageNavigationStickyRef = useRef<HTMLDivElement>(null);
  const navGridCellRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const { isEnhanced, windowSize } = useAppContext();
  const [hasStuck, setHasStuck] = useState(false);
  const [isListActive, setIsListActive] = useState(true);
  const [scrollPosition, setScrollposition] = useState(0);
  const prevHasStuckRef = useRef(false);
  const loadedWithHashRef = useRef(
    typeof window !== 'undefined' && !!window.location.hash
  );

  const shouldLockScroll = useMemo(() => {
    return windowSize !== 'md' && isListActive && hasStuck;
  }, [windowSize, isListActive, hasStuck]);

  // Handle initial page load with hash
  useEffect(() => {
    if (loadedWithHashRef.current) {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Prevent default browser scroll
        window.history.scrollRestoration = 'manual';

        // Manually set the nav state
        setIsListActive(false);
        setHasStuck(true);

        // Wait for next frame to ensure layout is complete
        requestAnimationFrame(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView();
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    // We close the mobile nav if it's open when we're going from !hasStuck to hasStuck

    if (hasStuck && !prevHasStuckRef.current) {
      if (isListActive) {
        setIsListActive(false);
      }

      // On small screens the nav becomes position: fixed when stuck,
      // so scroll to the first element after the nav to keep the
      // transition seamless. Skip when the user clicked a nav link
      // or when the page loaded with a hash fragment (the browser is
      // scrolling to that target).
      if (
        !clickedId &&
        !loadedWithHashRef.current &&
        windowSize !== 'md' &&
        windowSize !== 'lg'
      ) {
        const nextEl = navGridCellRef.current?.nextElementSibling;
        if (nextEl) {
          nextEl.scrollIntoView();
        }
      }
      loadedWithHashRef.current = false;
    }
    prevHasStuckRef.current = hasStuck;
  }, [hasStuck, isListActive, clickedId, windowSize]);

  useEffect(() => {
    // We close the mobile nav if the user resizes their window to the large bp
    if (windowSize === 'md' && hasStuck && isListActive) {
      setIsListActive(false);
    }
  }, [windowSize, hasStuck, isListActive]);

  useEffect(() => {
    if (!InPageNavigationStickyRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAboveViewport = entry.boundingClientRect.top <= 1;
        setHasStuck(!entry.isIntersecting && isAboveViewport);
      },
      {
        root: document,
        rootMargin: '-1px',
      }
    );

    observer.observe(InPageNavigationStickyRef.current);
  }, [InPageNavigationStickyRef.current]);

  useEffect(() => {
    if (!clickedId) return;

    const resetClickedId = () => {
      setClickedId(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only reset on scroll-related keys
      const scrollKeys = [
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
        ' ', // Space
      ];
      if (scrollKeys.includes(e.key)) {
        resetClickedId();
      }
    };

    window.addEventListener('wheel', resetClickedId, { passive: true });
    window.addEventListener('touchmove', resetClickedId, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('wheel', resetClickedId);
      window.removeEventListener('touchmove', resetClickedId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [clickedId]);

  useEffect(() => {
    if (clickedId === observedActiveId) {
      setClickedId(null);
    }
  }, [clickedId, observedActiveId]);

  // Determine the active id based on whether sticky is enabled
  const activeId = clickedId || observedActiveId;

  const titleText = 'On this page';

  const [activeLinkText, setActiveLinkText] = useState(titleText);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setActiveLinkText(
      links.find(link => link.url.replace('#', '') === activeId)?.text ||
        titleText
    );
  }, [activeId]);

  return (
    <NavGridCell
      ref={navGridCellRef}
      $isOnWhite={!!isOnWhite}
      $sizeMap={sizeMap}
    >
      {shouldLockScroll && (
        <>
          {/* https://github.com/wellcomecollection/wellcomecollection.org/pull/12171
          This portal is required because of an older version of Safari,
          consider removing once moved to v21 */}
          {createPortal(
            <BackgroundOverlay
              data-lock-scroll={true}
              onClick={() => setIsListActive(false)}
            />,
            document.body
          )}
        </>
      )}

      <FocusTrap
        active={isListActive && hasStuck}
        focusTrapOptions={{
          returnFocusOnDeactivate: false,
          clickOutsideDeactivates: true,
          initialFocus: false,
        }}
      >
        <Root $hasStuck={hasStuck} data-in-page-navigation-sticky="true">
          <h2 className={`${font('sans-bold', -1)} is-hidden-s is-hidden-m`}>
            {titleText}
          </h2>

          <MobileNavButton
            $isListActive={isListActive}
            $isOnWhite={!!isOnWhite}
            $hasStuck={hasStuck}
            ref={buttonRef}
            aria-expanded={isListActive}
            aria-controls={listId}
            onClick={() => {
              if (!isListActive) {
                setScrollposition(window.scrollY);
              } else {
                window.scrollTo({
                  top: scrollPosition,
                  behavior: 'instant',
                });
              }
              setIsListActive(!isListActive);
            }}
          >
            <AnimatedTextContainer>
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={hasStuck ? activeLinkText : titleText}
                  timeout={200}
                  nodeRef={textRef}
                  onEnter={() => {
                    if (textRef.current) {
                      textRef.current.style.opacity = '0';
                      textRef.current.style.transform = 'translateY(20px)';
                    }
                  }}
                  onEntering={() => {
                    if (textRef.current) {
                      textRef.current.style.opacity = '1';
                      textRef.current.style.transform = 'translateY(0)';
                    }
                  }}
                  onExit={() => {
                    if (textRef.current) {
                      textRef.current.style.opacity = '1';
                      textRef.current.style.transform = 'translateY(0)';
                    }
                  }}
                  onExiting={() => {
                    if (textRef.current) {
                      textRef.current.style.opacity = '0';
                      textRef.current.style.transform = 'translateY(-20px)';
                    }
                  }}
                >
                  <span
                    ref={textRef}
                    style={{
                      display: 'block',
                      position: 'absolute',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      top: 0,
                      left: 0,
                      right: 0,
                      whiteSpace: 'nowrap',
                      transition: 'all 200ms cubic-bezier(0.25,0.1,0.25,1)',
                    }}
                  >
                    {isListActive
                      ? titleText
                      : hasStuck
                        ? activeLinkText
                        : titleText}
                  </span>
                </CSSTransition>
              </SwitchTransition>
            </AnimatedTextContainer>

            {isEnhanced && <Icon icon={cross} matchText />}
          </MobileNavButton>

          <InPageNavList
            $hasStuck={hasStuck}
            $isListActive={isListActive}
            ref={listRef}
            id={listId}
            $isOnWhite={!!isOnWhite}
          >
            {links.map((link: Link, index) => {
              const id = link.url.replace('#', '');
              const isActive = activeId === id;
              return (
                <Fragment key={link.url}>
                  <ListItem $hasStuck={hasStuck} $isOnWhite={!!isOnWhite}>
                    <InPageNavAnimatedLink
                      href={link.url}
                      $hasStuck={hasStuck}
                      $isActive={isActive}
                      $isOnWhite={!!isOnWhite}
                      $lineColor={
                        hasStuck ? 'black' : isOnWhite ? 'black' : 'white'
                      }
                      {...dataGtmPropsToAttributes({
                        trigger: 'link_click_page_position',
                        'position-in-list': `${index + 1}`,
                        label: id,
                      })}
                      onClick={e => {
                        e.preventDefault();
                        setClickedId(id);
                        setIsListActive(false);

                        const element = document.getElementById(id);
                        if (element) {
                          const buttonHeight =
                            buttonRef.current?.offsetHeight || 0;

                          const elementPosition =
                            element.getBoundingClientRect().top;
                          let offsetPosition = elementPosition + window.scrollY;

                          // On mobile (below md breakpoint)
                          if (windowSize !== 'md' && windowSize !== 'lg') {
                            // When hasStuck is false and the list was open before clicking,
                            // account for the list height that will be removed when the list closes
                            if (!hasStuck && isListActive && listRef.current) {
                              offsetPosition -= listRef.current.offsetHeight;
                            }

                            // Account for the fixed button height that will overlay the content
                            // plus 1px for the border
                            offsetPosition -= buttonHeight + 1;
                          } else {
                            // Desktop behavior: account for scroll-margin-top
                            offsetPosition -= 32;
                          }

                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth',
                          });
                          window.history.replaceState(null, '', `#${id}`);
                        }
                      }}
                    >
                      <span>{link.text}</span>
                    </InPageNavAnimatedLink>
                  </ListItem>
                </Fragment>
              );
            })}
          </InPageNavList>
        </Root>
      </FocusTrap>
      <div ref={InPageNavigationStickyRef}></div>
      {/* Placeholder to prevent jump when nav becomes fixed on mobile */}
      {hasStuck && windowSize !== 'md' && windowSize !== 'lg' && (
        <div style={{ height: buttonRef.current?.offsetHeight || 0 }} />
      )}
    </NavGridCell>
  );
};

export default InPageNavigationSticky;
