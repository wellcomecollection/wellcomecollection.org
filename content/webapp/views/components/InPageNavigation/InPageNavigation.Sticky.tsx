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
import { Link } from '@weco/content/types/link';

import {
  AnimatedTextContainer,
  BackgroundOverlay,
  InPageNavAnimatedLink,
  InPageNavList,
  ListItem,
  MobileNavButton,
  Root,
} from './InPageNavigation.Sticky.styles';

export type Props = {
  isOnWhite?: boolean;
  links: Link[];
};

const InPageNavigationSticky: FunctionComponent<Props> = ({
  links,
  isOnWhite,
}) => {
  // Extract ids from links (strip leading #)
  const ids = links.map(link => link.url.replace('#', ''));
  const observedActiveId = useActiveAnchor(ids);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [lock, setLock] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const InPageNavigationStickyRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const { isEnhanced, windowSize } = useAppContext();
  const [hasStuck, setHasStuck] = useState(false);
  const [isListActive, setIsListActive] = useState(false);
  const [scrollPosition, setScrollposition] = useState(0);
  const prevHasStuckRef = useRef(false);

  const shouldLockScroll = useMemo(() => {
    return windowSize !== 'large' && isListActive && hasStuck;
  }, [windowSize, isListActive, hasStuck]);

  useEffect(() => {
    // We close the mobile nav if it's open when we're going from !hasStuck to hasStuck

    if (hasStuck && !prevHasStuckRef.current && isListActive) {
      setIsListActive(false);
    }
    prevHasStuckRef.current = hasStuck;
  }, [hasStuck, isListActive]);

  useEffect(() => {
    // We close the mobile nav if the user resizes their window to the large bp
    if (windowSize === 'large' && hasStuck && isListActive) {
      setIsListActive(false);
    }
  }, [windowSize, hasStuck, isListActive]);

  useEffect(() => {
    if (!buttonRef.current) return;

    buttonRef.current.setAttribute('aria-expanded', 'false');
    buttonRef.current.setAttribute('aria-controls', listId);
  }, [buttonRef.current]);

  useEffect(() => {
    if (!InPageNavigationStickyRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHasStuck(!entry.isIntersecting);
      },
      {
        root: document,
        rootMargin: '-1px',
      }
    );

    observer.observe(InPageNavigationStickyRef.current);
  }, [InPageNavigationStickyRef.current]);

  // When an anchor is clicked, lock for a short time before allowing scroll to clear
  useEffect(() => {
    if (!clickedId) return;
    setLock(true);
    const timeout = setTimeout(() => {
      setLock(false);
    }, 1000); // 1s lock
    return () => clearTimeout(timeout);
  }, [clickedId]);

  // When the user scrolls, clear clickedId if it is set and not locked
  useEffect(() => {
    if (!clickedId || lock) return;
    const handleScroll = () => {
      setClickedId(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [clickedId, lock]);

  // Determine the active id based on whether sticky is enabled
  const activeId = clickedId || observedActiveId;

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.classList.add('is-hidden-s', 'is-hidden-m');
  }, [listRef.current]);

  const titleText = 'On this page';

  const [activeLinkText, setActiveLinkText] = useState(titleText);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!listRef.current || !buttonRef.current) return;

    listRef.current.classList[isListActive ? 'remove' : 'add'](
      'is-hidden-s',
      'is-hidden-m'
    );
    buttonRef.current.setAttribute('aria-expanded', `${isListActive}`);
  }, [isListActive]);

  useEffect(() => {
    setActiveLinkText(
      links.find(link => link.url.replace('#', '') === activeId)?.text ||
        titleText
    );
  }, [activeId]);

  return (
    <>
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
      <div ref={InPageNavigationStickyRef}></div>
      <FocusTrap
        active={isListActive}
        focusTrapOptions={{
          returnFocusOnDeactivate: false,
          clickOutsideDeactivates: true,
        }}
      >
        <Root $hasStuck={hasStuck} data-scroll-smooth="true">
          <h2 className={`${font('intm', -1)} is-hidden-s is-hidden-m`}>
            {titleText}
          </h2>

          <MobileNavButton
            $isListActive={isListActive}
            $isOnWhite={!!isOnWhite}
            $hasStuck={hasStuck}
            ref={buttonRef}
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

          <InPageNavList ref={listRef} id={listId} $isOnWhite={!!isOnWhite}>
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
                      onClick={() => {
                        setClickedId(id);
                        setIsListActive(false);
                        const el = document.getElementById(id);
                        if (el) {
                          el.tabIndex = -1;
                          el.focus();
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
    </>
  );
};

export default InPageNavigationSticky;
