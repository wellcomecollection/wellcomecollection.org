import NextLink from 'next/link';
import {
  Fragment,
  FunctionComponent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import { cross } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import { PaletteColor } from '@weco/common/views/themes/config';
import { Link } from '@weco/content/types/link';

import {
  Anchor,
  AnimatedTextContainer,
  BackgroundOverlay,
  InPageNavAnimatedLink,
  ListItem,
  MobileNavButton,
  Root,
} from './OnThisPageAnchors.styles';

export type Props = {
  isSticky?: boolean;
  hasBackgroundBlend?: boolean;
  activeColor?: PaletteColor;
  links: Link[];
};

const OnThisPageAnchors: FunctionComponent<Props> = ({
  isSticky = false,
  hasBackgroundBlend = false,
  links,
}) => {
  // Extract ids from links (strip leading #)
  const ids = links.map(link => link.url.replace('#', ''));
  const observedActiveId = useActiveAnchor(ids);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [lock, setLock] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const onThisPageAnchorsStickyRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const { isEnhanced } = useAppContext();
  const [hasStuck, setHasStuck] = useState(false);
  const [isListActive, setIsListActive] = useState(false);

  useEffect(() => {
    if (!buttonRef.current) return;

    buttonRef.current.setAttribute('aria-expanded', 'false');
    buttonRef.current.setAttribute('aria-controls', listId);
  }, [buttonRef.current]);

  useEffect(() => {
    if (!onThisPageAnchorsStickyRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHasStuck(!entry.isIntersecting);
      },
      {
        root: document,
        rootMargin: '-1px',
      }
    );

    observer.observe(onThisPageAnchorsStickyRef.current);
  }, [onThisPageAnchorsStickyRef.current]);

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
  const activeId = isSticky ? clickedId || observedActiveId : clickedId;

  // Update the URL hash when activeId changes, but only if it doesn't match the current hash
  useEffect(() => {
    if (!activeId || typeof window === 'undefined') return;
    if (window.location.hash.replace('#', '') !== activeId) {
      history.replaceState(null, '', `#${activeId}`);
    }
  }, [activeId]);

  useEffect(() => {
    if (!listRef.current || !isSticky) return;
    listRef.current.classList.add('is-hidden-s', 'is-hidden-m');
  }, [listRef.current]);

  const titleText = isSticky ? 'On this page' : 'What’s on this page';
  const fontStyle = isSticky ? font('intm', 5) : font('wb', 4);
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
      <BackgroundOverlay
        $isActive={isListActive}
        onClick={() => setIsListActive(false)}
      />
      <div ref={onThisPageAnchorsStickyRef}></div>
      <Root
        $isSticky={isSticky}
        $hasBackgroundBlend={hasBackgroundBlend}
        $hasStuck={hasStuck}
      >
        <h2
          className={`${fontStyle} ${isSticky ? 'is-hidden-s is-hidden-m' : ''}`}
        >
          {titleText}
        </h2>
        {isSticky && (
          <MobileNavButton
            $hasStuck={hasStuck}
            ref={buttonRef}
            onClick={() => setIsListActive(!isListActive)}
          >
            <AnimatedTextContainer>
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={hasStuck && !isListActive ? activeLinkText : titleText}
                  timeout={300}
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
                      transition: 'all 300ms ease-in-out',
                    }}
                  >
                    {hasStuck && !isListActive ? activeLinkText : titleText}
                  </span>
                </CSSTransition>
              </SwitchTransition>
            </AnimatedTextContainer>

            {isEnhanced && <Icon icon={cross} matchText />}
          </MobileNavButton>
        )}
        <PlainList ref={listRef} id={listId}>
          {links.map((link: Link) => {
            const id = link.url.replace('#', '');
            const isActive = activeId === id;
            return (
              <Fragment key={link.url}>
                {isSticky ? (
                  <ListItem $hasStuck={hasStuck}>
                    <NextLink
                      passHref
                      legacyBehavior
                      style={{ textDecoration: 'none' }}
                      href={link.url}
                    >
                      <InPageNavAnimatedLink
                        $hasStuck={hasStuck}
                        $isActive={isActive}
                        $hasBackgroundBlend={hasBackgroundBlend}
                        data-gtm-trigger="link_click_page_position"
                        onClick={e => {
                          e.preventDefault();
                          setClickedId(id);
                          setIsListActive(false);
                          const el = document.getElementById(id);
                          if (el) {
                            el.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                            el.tabIndex = -1;
                            el.focus();
                          }
                        }}
                      >
                        <span>{link.text}</span>
                      </InPageNavAnimatedLink>
                    </NextLink>
                  </ListItem>
                ) : (
                  <li>
                    <Anchor
                      data-gtm-trigger="link_click_page_position"
                      href={link.url}
                    >
                      {link.text}
                    </Anchor>
                  </li>
                )}
              </Fragment>
            );
          })}
        </PlainList>
      </Root>
    </>
  );
};

export default OnThisPageAnchors;
