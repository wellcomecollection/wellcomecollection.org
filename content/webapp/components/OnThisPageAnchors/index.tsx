import NextLink from 'next/link';
import {
  Fragment,
  FunctionComponent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import { cross } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import { Link } from '@weco/content/types/link';

// Used to set the left offset for the active indicator line in sticky mode
const leftOffset = '12px';

const ListItem = styled.li`
  position: relative;
  padding-left: ${leftOffset};
  padding-bottom: 6px;
  padding-top: 6px;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 1px;
    top: 0;
    bottom: 0;
    width: 1px;
    height: 100%;
    background: ${props => props.theme.color('black')};
  }
`;

// If used elsewhere, this could be extracted to a shared styled component
const AnimatedLink = styled.a`
  --line: ${props => props.theme.color('white')};
  text-decoration: none;
  position: relative;

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
}>`
  color: ${props =>
    props.$hasBackgroundBlend ? props.theme.color('white') : 'inherit'};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -${leftOffset};
    top: 0;
    height: 100%;
    width: 3px;
    background: ${props => props.theme.color('white')};
    opacity: ${props => (props.$isActive ? 1 : 0)};
    transform: scaleY(${props => (props.$isActive ? 1 : 0.5)});
    transition:
      opacity ${props => props.theme.transitionProperties},
      transform ${props => props.theme.transitionProperties};
  }
`;

const stickyRootAttrs = `
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Root = styled(Space).attrs<{ $isSticky?: boolean }>(props => ({
  as: 'nav',
  $h: props.$isSticky
    ? undefined
    : { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
}))<{
  $isSticky?: boolean;
  $hasBackgroundBlend?: boolean;
}>`
  ${props => (props.$isSticky ? stickyRootAttrs : '')}
  ${props =>
    !props.$hasBackgroundBlend
      ? `background: ${props.theme.color('warmNeutral.300')};`
      : `mix-blend-mode: difference; color: ${props.theme.color('white')};`}
`;

const MobileNavButton = styled.button`
  border-top: 1px solid ${props => props.theme.color('white')};
  border-bottom: 1px solid ${props => props.theme.color('white')};
  padding: 0.5rem 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: white;

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const { isEnhanced } = useAppContext();

  useEffect(() => {
    if (!buttonRef.current) return;

    buttonRef.current.setAttribute('aria-expanded', 'false');
    buttonRef.current.setAttribute('aria-controls', listId);
  }, [buttonRef.current]);

  // When an anchor is clicked, lock for a short time before allowing scroll to clear
  useEffect(() => {
    if (!clickedId) return;
    setLock(true);
    const timeout = setTimeout(() => {
      setLock(false);
    }, 600); // 600ms lock
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
    if (!listRef.current) return;
    listRef.current.classList.add('is-hidden-s');
    listRef.current.classList.add('is-hidden-m');
  }, [listRef.current]);

  function toggleList() {
    if (!listRef.current || !buttonRef.current) return;

    if (listRef.current.classList.contains('is-hidden-s')) {
      listRef.current.classList.remove('is-hidden-s');
      listRef.current.classList.remove('is-hidden-m');

      buttonRef.current.setAttribute('aria-expanded', 'true');
    } else {
      listRef.current.classList.add('is-hidden-s');
      listRef.current.classList.add('is-hidden-m');
      buttonRef.current.setAttribute('aria-expanded', 'false');
    }
  }

  function hideMobileList() {
    if (!listRef.current || !buttonRef.current) return;

    listRef.current.classList.add('is-hidden-s');
    listRef.current.classList.add('is-hidden-m');
    buttonRef.current.setAttribute('aria-expanded', 'false');
  }

  const titleText = isSticky ? 'On this page' : 'What’s on this page';
  const fontStyle = isSticky ? font('intm', 5) : font('wb', 4);

  return (
    <Root $isSticky={isSticky} $hasBackgroundBlend={hasBackgroundBlend}>
      <h2 className={`${fontStyle} is-hidden-s is-hidden-m`}>{titleText}</h2>
      <MobileNavButton ref={buttonRef} onClick={toggleList}>
        {titleText}
        {isEnhanced && <Icon icon={cross} matchText />}
      </MobileNavButton>
      <PlainList ref={listRef} id={listId}>
        {links.map((link: Link) => {
          const id = link.url.replace('#', '');
          const isActive = activeId === id;
          return (
            <Fragment key={link.url}>
              {isSticky ? (
                <ListItem>
                  <NextLink
                    passHref
                    legacyBehavior
                    style={{ textDecoration: 'none' }}
                    href={link.url}
                    data-gtm-trigger="link_click_page_position"
                    onClick={e => {
                      e.preventDefault();
                      hideMobileList();
                      setClickedId(id);
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }
                    }}
                  >
                    <InPageNavAnimatedLink
                      $isActive={isActive}
                      $hasBackgroundBlend={hasBackgroundBlend}
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
  );
};

export default OnThisPageAnchors;
