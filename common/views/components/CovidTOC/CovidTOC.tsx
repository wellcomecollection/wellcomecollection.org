import Space from '../styled/Space';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';

type TOCLinkProps = {
  isSublink?: boolean;
};

const TOCLink = styled.a.attrs((props: TOCLinkProps) => ({
  className: classNames({
    [font(props.isSublink ? 'hnl' : 'hnm', 5)]: true,
  }),
}))<TOCLinkProps>`
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
        {links.map(link => (
          <li>
            <TOCLink href={link.url}>{link.text}</TOCLink>
            {link.sublinks && (
              <ul>
                {link.sublinks.map(sublink => (
                  <TOCLink isSublink>
                    <a href={sublink.url}>{sublink.text}</a>
                  </TOCLink>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Space>
  );
};

export default CovidTOC;
