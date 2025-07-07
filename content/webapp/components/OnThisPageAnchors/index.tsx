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
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import { cross } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor, themeValues } from '@weco/common/views/themes/config';
import { Link } from '@weco/content/types/link';

// Used to set the left offset for the active indicator line in sticky mode
const leftOffset = '12px';

const BackgroundOverlay = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props =>
    props.$isActive ? props.theme.color('black') : 'transparent'};
  opacity: ${props => (props.$isActive ? 0.7 : 0)};
  transition: opacity ${props => props.theme.transitionProperties};
  z-index: ${props => (props.$isActive ? '10' : '-1')};
`;

const ListItem = styled.li<{ $hasStuck: boolean }>`
  position: relative;
  padding-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid
    ${props => props.theme.color(props.$hasStuck ? 'white' : 'transparent')};

  margin-left: -${themeValues.containerPadding.small}px;
  margin-right: -${themeValues.containerPadding.small}px;
  padding-left: calc(${themeValues.containerPadding.small}px + ${leftOffset});
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  padding-right: ${themeValues.containerPadding.small}px;

  ${props =>
    props.theme.media('medium')(`
    margin-left: -${themeValues.containerPadding.medium}px;
    margin-right: -${themeValues.containerPadding.medium}px;
    padding-left: calc(${themeValues.containerPadding.medium}px + ${leftOffset});
    padding-right: ${themeValues.containerPadding.medium}px;
  `)}

  &::before {
    content: '';
    display: ${props => (props.$hasStuck ? 'none' : 'block')};
    position: absolute;
    left: calc(${themeValues.containerPadding.small}px + 1px);
    top: 0;
    bottom: 0;
    width: 1px;
    height: 100%;
    background: ${props => props.theme.color('black')};
  }

  ${props =>
    props.theme.media('medium')(`
      &::before {
        left: calc(${themeValues.containerPadding.medium}px + 1px);
      }
    `)}

  ${props =>
    props.theme.media('large')(`
    border-top: 0;
    padding: 6px 0  6px ${leftOffset};
    margin: 0;

    &::before {
      display: block;
      left: 1px;
    }
    `)}
`;

// If used elsewhere, this could be extracted to a shared styled component
const AnimatedLink = styled.a<{ $hasStuck: boolean }>`
  --line: ${props => props.theme.color(props.$hasStuck ? 'black' : 'white')};
  text-decoration: none;
  position: relative;

  ${props =>
    props.theme.media('large')(`
    --line: ${props.theme.color('white')};
    `)}

  & > span {
    background-image: linear-gradient(0deg, var(--line) 0%, var(--line) 100%);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: var(--background-size, 0%) 2px;
    transition: background-size ${props => props.theme.transitionProperties};
    font-size: 14px;
    line-height: 20px;
    transform: translateZ(0);
    padding-bottom: 2px;
  }

  &:hover {
    --background-size: 100%;
  }
`;

const Anchor = styled.a.attrs({
  className: font('intb', 5),
})`
  color: ${props => props.theme.color('black')};
`;

const InPageNavAnimatedLink = styled(AnimatedLink)<{
  $isActive?: boolean;
  $hasBackgroundBlend?: boolean;
  $hasStuck: boolean;
}>`
  color: ${props =>
    props.$hasBackgroundBlend
      ? props.theme.color(props.$hasStuck ? 'black' : 'white')
      : 'inherit'};
  position: relative;
  display: block;

  &::before {
    content: '';
    position: absolute;
    left: -${leftOffset};
    top: 0;
    height: 100%;
    width: 3px;
    background: ${props =>
      props.theme.color(props.$hasStuck ? 'accent.green' : 'white')};
    opacity: ${props => (props.$isActive ? 1 : 0)};
    transform: scaleY(${props => (props.$isActive ? 1 : 0.5)});
    transition:
      opacity ${props => props.theme.transitionProperties},
      transform ${props => props.theme.transitionProperties};
  }

  ${props =>
    props.theme.media('large')(`
    color: ${props.$hasBackgroundBlend ? props.theme.color('white') : 'inherit'};

    &::before {
      background: ${props.theme.color('white')};
    `)}
`;

const stickyRootAttrs = `
  position: sticky;
  top: 0;
  z-index: 20;
`;

const Root = styled(Space).attrs<{ $isSticky?: boolean; $hasStuck: boolean }>(
  props => ({
    as: 'nav',
    $h: props.$isSticky
      ? undefined
      : { size: 'l', properties: ['padding-left', 'padding-right'] },
    $v: {
      size: 'l',
      properties: props.$isSticky
        ? ['padding-top']
        : ['padding-top', 'padding-bottom'],
    },
  })
)<{
  $isSticky?: boolean;
  $hasBackgroundBlend?: boolean;
  $hasStuck: boolean;
}>`
  background: ${props =>
    !props.$hasBackgroundBlend && props.theme.color('warmNeutral.300')};
  ${props => (props.$isSticky ? stickyRootAttrs : '')}
  ${props =>
    props.$hasStuck &&
    `
    border-bottom: 1px solid ${props.theme.color('white')};
  `}

  ${props =>
    props.theme.media('large')(`
    border-bottom: 0;
  `)}

  ${props =>
    props.$isSticky &&
    props.theme.mediaBetween(
      'small',
      'medium'
    )(`
      margin-left: -${themeValues.containerPadding.small}px;
      margin-right: -${themeValues.containerPadding.small}px;
      padding-left: ${themeValues.containerPadding.small}px;
      padding-right: ${themeValues.containerPadding.small}px;

    `)}

  ${props =>
    props.$isSticky &&
    props.theme.mediaBetween(
      'medium',
      'large'
    )(`
      margin-left: -${themeValues.containerPadding.medium}px;
      margin-right: -${themeValues.containerPadding.medium}px;
      padding-left: ${props.theme.containerPadding.medium}px;
      padding-right: ${props.theme.containerPadding.medium}px;
    `)}

  ${props =>
    props.$isSticky &&
    props.theme.mediaBetween(
      'small',
      'large'
    )(`
      transition: background ${props.theme.transitionProperties};
      background: ${props.$hasStuck && props.theme.color('accent.lightGreen')};
      padding-top: 0;
    `)}

  ${props =>
    props.$isSticky &&
    props.theme.media('large')(`
      background: ${!props.$hasBackgroundBlend && props.theme.color('warmNeutral.300')};
      mix-blend-mode: ${props.$hasBackgroundBlend && 'difference'};
      color: ${props.$hasBackgroundBlend && props.theme.color('white')};
    `)}
`;

const MobileNavButton = styled.button.attrs({
  className: font('intm', 5),
})<{ $hasStuck: boolean }>`
  border-top: ${props =>
    !props.$hasStuck && `1px solid ${props.theme.color('white')}`};
  border-bottom: ${props =>
    !props.$hasStuck && `1px solid ${props.theme.color('white')}`};
  padding: 12px 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${props => props.theme.color(props.$hasStuck ? 'black' : 'white')};

  .icon {
    transition: transform ${props => props.theme.transitionProperties};
  }

  nav:has(ul.is-hidden-s) & {
    .icon {
      transform: rotate(45deg);
    }
  }

  ${props => props.theme.media('large')`
    display: none;
  `}
`;

const AnimatedTextContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 20px;
  line-height: 20px;
  width: 100%;
`;

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
    buttonRef.current.setAttribute(
      'aria-expanded',
      isListActive ? 'true' : 'false'
    );
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
