import Space from '../styled/Space';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
const TOCLink = styled.a.attrs({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
})`
  color: ${props => props.theme.color('green')};
`;

type Link = {
  text: string;
  url: string;
};

type Props = {
  links: Link[];
};

const CovidTOC = ({ links }) => {
  return (
    <Space
      h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
      v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
      style={{
        background: 'rgba(0, 120, 108, 0.1)',
      }}
    >
      <h2 className="h3">What's on this page</h2>
      <ul className="plain-list no-margin no-padding">
        {links.map(({ text, url }) => (
          <li>
            <TOCLink href={url}>{text}</TOCLink>
          </li>
        ))}
      </ul>
    </Space>
  );
};

export default CovidTOC;
