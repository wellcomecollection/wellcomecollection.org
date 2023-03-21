import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { Link } from '../../types/link';
import { font } from '@weco/common/utils/classnames';
import { FunctionComponent } from 'react';

const Anchor = styled.a.attrs({
  className: font('intb', 5),
})`
  color: ${props => props.theme.color('black')};
`;

const Root = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

type Props = {
  links: Link[];
};

const OnThisPageAnchors: FunctionComponent<Props> = ({ links }) => {
  return (
    <Root>
      <h2 className="h3">What’s on this page</h2>
      <PlainList>
        {links.map((link: Link) => (
          <li key={link.url}>
            <Anchor href={link.url}>{link.text}</Anchor>
          </li>
        ))}
      </PlainList>
    </Root>
  );
};

export default OnThisPageAnchors;
