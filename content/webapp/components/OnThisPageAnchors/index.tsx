 
import { FunctionComponent, useState, useEffect } from 'react';
import { useActiveAnchor } from '@weco/common/hooks/useActiveAnchor';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { Link } from '@weco/content/types/link';


const Anchor = styled.a.attrs<{ $active?: boolean }>(() => ({
  className: font('intb', 5),
}))<{$active?: boolean}>`
  color: ${props => props.$active ? props.theme.color('yellow') : props.theme.color('white')};
  mix-blend-mode: difference;
  text-decoration: ${props => props.$active ? 'underline' : 'none'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
`;

const Root = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  // background: ${props => props.theme.color('warmNeutral.300')};
  mix-blend-mode: difference;
  color: ${props => props.theme.color('white')};
`;

// create new Root function component that takes a sticky prop
const RootWithSticky = styled(Root)<{ sticky?: boolean }>`
  position: ${props => (props.sticky ? 'sticky' : 'static')};
  top: 0px;
  z-index: 1;
`;

export type Props = {
  sticky?: boolean;
  links: Link[];
};

const OnThisPageAnchors: FunctionComponent<Props> = ({ sticky, links }) => {
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

  const activeId = clickedId || observedActiveId;

  const handleClick = (id: string) => () => {
    setClickedId(id);
  };

  return (
    <RootWithSticky sticky={sticky}>
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
                onClick={handleClick(id)}
              >
                {link.text}
              </Anchor>
            </li>
          );
        })}
      </PlainList>
    </RootWithSticky>
  );
};

export default OnThisPageAnchors;
