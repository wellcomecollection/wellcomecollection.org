import { FunctionComponent, useState, useEffect } from 'react';
import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import styled from 'styled-components';

import { font, FontFamily } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { Link } from '@weco/content/types/link';

const ListItem = styled.li<{ $active?: boolean; $sticky?: boolean }>`
  ${props => props.$sticky ? `
  position: relative;
  padding-left: 12px;
  padding-bottom: 6px;
  padding-top: 6px;
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: ${props.$active ? '0px' : '1px'};
    top: 0;
    bottom: 0;
    width: ${props.$active ? '3px' : '1px'};
    background: ${props.$active ? props.theme.color('warmNeutral.400') : props.theme.color('neutral.400')};
  }
` : ''}
`;

const Anchor = styled.a.attrs<{
  $active?: boolean;
  $backgroundBlend?: boolean;
  $sticky?: boolean;
}>(() => ({
  className: font('intb', 5),
}))<{
  $active?: boolean;
  $backgroundBlend?: boolean;
  $sticky?: boolean;
}>`
  ${props => props.$backgroundBlend ? `
    mix-blend-mode: difference; 
    color: ${props.theme.color('white')};
    ` : ''}
    
  ${props => props.$sticky ? `
    text-decoration: ${props.$active ? 'none' : 'underline'};
    text-underline-position: under;
    font-weight: ${props.$active ? 'bold' : 'normal'};
    ` : ''}
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
  sticky?: boolean,
  backgroundBlend?: boolean
}>`
  ${props => props.sticky ? stickyRootAttrs : ''}
  ${props => !props.backgroundBlend
    ? `background: ${props.theme.color('warmNeutral.300')}; color: ${props.theme.color('black')};`
    : `mix-blend-mode: difference; color: ${props.theme.color('white')};`}
`;

export type Props = {
  sticky?: boolean;
  backgroundBlend?: boolean;
  links: Link[];
};

const OnThisPageAnchors: FunctionComponent<Props> = ({ sticky, backgroundBlend, links }) => {
  // Defaults for props
  sticky = sticky ?? false;
  backgroundBlend = backgroundBlend ?? false;

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
  const activeId = sticky ? (clickedId || observedActiveId) : clickedId;


  // Update the URL hash when activeId changes, but only if it doesn't match the current hash
  useEffect(() => {
    if (!activeId || typeof window === 'undefined') return;
    if (window.location.hash.replace('#', '') !== activeId) {
      history.replaceState(null, '', `#${activeId}`);
    }
  }, [activeId]);

  const handleClick = (id: string) => () => {
    setClickedId(id);
  };

  const titleText = sticky ? 'On this page' : 'What’s on this page';
  const fontStyle = sticky ? font('intr', 4) : font('wb', 4) as FontFamily;

  return (
    <Root sticky={sticky} backgroundBlend={backgroundBlend}>
      <h2 className={fontStyle}>{titleText}</h2>
      <PlainList>
        {links.map((link: Link) => {
          const id = link.url.replace('#', '');
          const isActive = activeId === id;
          return (
            <ListItem key={link.url} $active={isActive} $sticky={sticky}>
              <Anchor
                data-gtm-trigger="link_click_page_position"
                href={link.url}
                $active={isActive}
                $backgroundBlend={backgroundBlend}
                $sticky={sticky}
                onClick={handleClick(id)}
              >
                {link.text}
              </Anchor>
            </ListItem>
          );


        })}
      </PlainList>
    </Root>
  );
};

export default OnThisPageAnchors;
