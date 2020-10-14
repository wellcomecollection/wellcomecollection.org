import Space from '../styled/Space';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';

const Anchor = styled.a.attrs(() => ({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
}))`
  color: ${props => props.theme.color('green')};
`;

type Link = {
  text: string;
  url: string;
  sublinks?: Link[];
};

type Props = {
  links: Link[];
};

const OnThisPageAnchors = ({ links }) => {
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
        {links.map(link => (
          <li>
            <Anchor href={link.url}>{link.text}</Anchor>
          </li>
        ))}
      </ul>
    </Space>
  );
};

export default OnThisPageAnchors;
