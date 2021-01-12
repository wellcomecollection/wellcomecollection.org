import { FunctionComponent } from 'react';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';

const ButtonLink = styled.a.attrs({
  className: classNames({
    [font('hnl', 5)]: true,
  }),
})`
  display: block;
  line-height: 1;
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  border: 2px solid ${props => props.theme.color('pumice')};
  background: ${props => props.theme.color('transparent')};
  color: ${props => props.theme.color('charcoal')};
  padding: 7px 12px 9px;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;

  &:focus {
    outline: 0;

    .is-keyboard & {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }
  }

  &:hover {
    text-decoration: underline;
  }
`;

type Link = {
  url: string;
  text: string;
};

type Props = {
  heading: string | null;
  links: Link[];
};

const LinksList: FunctionComponent<Props> = ({ links, heading }: Props) => {
  return (
    <>
      {heading && (
        <Space
          as="h2"
          v={{ size: 'm', properties: ['margin-bottom'] }}
          className={font('wb', 5)}
        >
          Listen or subscribe on
        </Space>
      )}
      <ul className="plain-list no-margin no-padding">
        {links.map((link, i) => (
          <Space
            as="li"
            v={{ size: 'm', properties: ['margin-bottom'] }}
            h={{ size: 'm', properties: ['margin-right'] }}
            key={`${link.text}-${i}`}
            className="inline-block"
          >
            <ButtonLink href={link.url}>{link.text}</ButtonLink>
          </Space>
        ))}
      </ul>
    </>
  );
};
export default LinksList;
