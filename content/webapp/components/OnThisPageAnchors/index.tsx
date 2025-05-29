 
import { FunctionComponent, useState, useEffect } from 'react';
import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { Link } from '@weco/content/types/link';


const Anchor = styled.a.attrs<{
  $active?: boolean;
  $background?: boolean;
  $sticky?: boolean;
}>(() => ({
  className: font('intb', 5),
}))<{
  $active?: boolean;
  $background?: boolean;
  $sticky?: boolean;
}>`
  ${props => !props.$background ? `
    mix-blend-mode: difference; 
    color: ${props.theme.color('white')};
    ` : ''}
    
  ${props => props.$sticky ? `
    text-decoration: ${props.$active ? 'none' : 'underline'};
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
  background?: boolean
}>`
  ${props => props.sticky ? stickyRootAttrs : ''}
  ${props => props.background
    ? `background: ${props.theme.color('warmNeutral.300')}; color: ${props.theme.color('black')};`
    : `mix-blend-mode: difference; color: ${props.theme.color('white')};`}
`;

export type Props = {
  sticky?: boolean;
  background?: boolean;
  links: Link[];
};

const OnThisPageAnchors: FunctionComponent<Props> = ({ sticky, background, links }) => {
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

  // Only use observedActiveId when sticky
  const activeId = sticky ? (clickedId || observedActiveId) : clickedId;

  const handleClick = (id: string) => () => {
    setClickedId(id);
  };

  return (
    <Root sticky={sticky} background={background}>
      <h2 className={font('wb', 4)}>What’s on this page</h2>
      <PlainList>
        {links.map((link: Link) => {
          const id = link.url.replace('#', '');
          return (
            <li key={link.url}>
              <Anchor
                data-gtm-trigger="link_click_page_position"
                href={link.url}
                $active={activeId === id}
                $background={background}
                $sticky={sticky}
                onClick={handleClick(id)}
              >
                {link.text}
              </Anchor>
            </li>
          );
        })}
      </PlainList>
    </Root>
  );
};

export default OnThisPageAnchors;
