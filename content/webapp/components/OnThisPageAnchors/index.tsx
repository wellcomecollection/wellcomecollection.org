import NextLink from 'next/link';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import { font } from '@weco/common/utils/classnames';
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
    transition: background-size 0.2s linear 300ms;
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
    top: 0px;
    height: 100%;
    width: 3px;
    background: ${props => props.theme.color('white')};
    opacity: ${props => (props.$isActive ? 1 : 0)};
    transform: scaleY(${props => (props.$isActive ? 1 : 0.5)});
    transition: opacity 0.3s, transform 0.3s;
  }
`;

const stickyRootAttrs = `
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Root = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})<{
  $isSticky?: boolean;
  $hasBackgroundBlend?: boolean;
}>`
  ${props => (props.$isSticky ? stickyRootAttrs : '')}
  ${props =>
    !props.$hasBackgroundBlend
      ? `background: ${props.theme.color('warmNeutral.300')};`
      : `mix-blend-mode: difference; color: ${props.theme.color('white')};`}
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

  // When an anchor is clicked, lock for a short time before allowing scroll to clear
  useEffect(() => {
    if (!clickedId) return;
    setLock(true);
    const timeout = setTimeout(() => {
      setLock(false);
    }, 600); // 300ms lock
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

  const titleText = isSticky ? 'On this page' : 'What’s on this page';
  const fontStyle = isSticky ? font('intm', 5) : font('wb', 4);

  return (
    <Root $isSticky={isSticky} $hasBackgroundBlend={hasBackgroundBlend}>
      <h2 className={fontStyle}>{titleText}</h2>

      
        {links.map((link: Link) => {
          const id = link.url.replace('#', '');
          const isActive = activeId === id;
          return (
            <PlainList>
              {isSticky ? (
                <ListItem key={link.url}>
                  <NextLink
                    passHref
                    style={{ textDecoration: 'none' }}
                    href={link.url}
                    data-gtm-trigger="link_click_page_position"
                    onClick={e => {
                      e.preventDefault();
                      setClickedId(id);
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            </PlainList>
          );
        })}
    </Root>
  );
};

export default OnThisPageAnchors;
