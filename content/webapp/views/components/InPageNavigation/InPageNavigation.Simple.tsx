import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { Link } from '@weco/content/types/link';

const Anchor = styled.a.attrs({
  className: font('intsb', -1),
})`
  color: ${props => props.theme.color('black')};
`;

const Root = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

export type Props = {
  links: Link[];
};

const InPageNavigationSimple: FunctionComponent<Props> = ({ links }) => {
  return (
    <Root>
      <h2 className={font('wb', 0)}>What’s on this page</h2>
      <PlainList>
        {links.map((link: Link) => (
          <li key={link.url}>
            <Anchor data-gtm-trigger="link_click_page_position" href={link.url}>
              {link.text}
            </Anchor>
          </li>
        ))}
      </PlainList>
    </Root>
  );
};

export default InPageNavigationSimple;
