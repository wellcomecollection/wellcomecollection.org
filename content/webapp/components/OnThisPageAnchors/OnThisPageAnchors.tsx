import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { LinkWithIndexChildren } from '@weco/content/services/prismic/transformers/pages';
import { font } from '@weco/common/utils/classnames';
import { FunctionComponent } from 'react';

const ListItem = styled.li`
  > ul {
    padding-left: 12px;
  }
`;

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
  links: LinkWithIndexChildren[];
};

const NestedList = ({ links }) => {
  return (
    <PlainList>
      {links.map((link: LinkWithIndexChildren) => (
        <ListItem key={link.url}>
          <Anchor href={link.url}>{link.text}</Anchor>
          {link.children && <NestedList links={link.children} />}
        </ListItem>
      ))}
    </PlainList>
  );
};

const OnThisPageAnchors: FunctionComponent<Props> = ({ links }) => {
  return (
    <Root>
      <h2 className="h3">What’s on this page</h2>
      <NestedList links={links} />
    </Root>
  );
};

export default OnThisPageAnchors;
