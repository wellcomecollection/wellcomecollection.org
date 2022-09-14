import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { Link } from '../../types/link';
import { font } from '@weco/common/utils/classnames';
import { FunctionComponent, ReactElement } from 'react';

const Anchor = styled.a.attrs(() => ({
  className: font('intb', 5),
}))`
  color: ${props => props.theme.color('green')};
`;

type Props = {
  links: Link[];
};

const OnThisPageAnchors: FunctionComponent<Props> = ({
  links,
}: Props): ReactElement<Props> => {
  return (
    <Space
      h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
      v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
      style={{
        background: 'rgba(0, 120, 108, 0.1)',
      }}
    >
      <h2 className="h3">What’s on this page</h2>
      <ul className="plain-list no-margin no-padding">
        {links.map((link: Link) => (
          <li key={link.url}>
            <Anchor href={link.url}>{link.text}</Anchor>
          </li>
        ))}
      </ul>
    </Space>
  );
};

export default OnThisPageAnchors;
