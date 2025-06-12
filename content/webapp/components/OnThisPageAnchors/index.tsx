import NextLink from 'next/link';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import { Link } from '@weco/content/types/link';

const ListItem = styled.li<{
  $isActive?: boolean;
  $isSticky?: boolean;
  $activeColor?: PaletteColor;
}>`
  ${props =>
    props.$isSticky
      ? `
  position: relative;
  padding-left: 12px;
  padding-bottom: 6px;
  padding-top: 6px;
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: ${props.$isActive ? '0px' : '1px'};
    top: 0;
    bottom: 0;
    width: ${props.$isActive ? '3px' : '1px'};
    background: ${props.theme.color((props.$isActive && props.$activeColor) || 'black')};
  }
`
      : ''}
`;

const AnimatedLink = styled.a`
  --line: ${props => props.theme.color('white')};
  text-decoration: none;
  position: relative;
  & > span {
    background-image: linear-gradient(0deg, var(--line) 0%, var(--line) 100%);
    background-position: 100% 100%;
    background-repeat: no-repeat;
    background-size: var(--background-size, 100%) 2px;
    transition: background-size 0.2s linear 300ms;
    font-size: 16px;
    line-height: 20px;
    transform: translateZ(0);
    padding-bottom: 2px;
  }
  &:hover {
    --background-size: 0%;
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
  font-weight: ${props => (props.$isActive ? 'bold' : 'normal')};
  ${props => (props.$isActive ? '--background-size: 0%;' : '')}
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
  activeColor,
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
    }, 300); // 300ms lock
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
  const fontStyle = isSticky ? font('intr', 4) : font('wb', 4);

  return (
    <Root $isSticky={isSticky} $hasBackgroundBlend={hasBackgroundBlend}>
      <h2 className={fontStyle}>{titleText}</h2>

      <PlainList>
        {links.map((link: Link) => {
          const id = link.url.replace('#', '');
          const isActive = activeId === id;
          return (
            <ListItem
              key={link.url}
              $isActive={isActive}
              $isSticky={isSticky}
              $activeColor={activeColor}
            >
              {isSticky ? (
                <NextLink
                  passHref
                  style={{ textDecoration: 'none' }}
                  href={link.url}
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
              ) : (
                <Anchor
                  data-gtm-trigger="link_click_page_position"
                  href={link.url}
                >
                  {link.text}
                </Anchor>
              )}
            </ListItem>
          );
        })}
      </PlainList>
    </Root>
  );
};

export default OnThisPageAnchors;
