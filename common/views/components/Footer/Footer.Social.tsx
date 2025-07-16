import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  facebook,
  IconSvg,
  instagram,
  xSocial,
  youtube,
} from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const Cell = styled(Space).attrs({
  $h: { size: 'm', properties: ['margin-right'] },
})`
  background-color: ${props => props.theme.color('neutral.200')};
  color: ${props => props.theme.color('black')};
  border-radius: 50%;
  transition: all ${props => props.theme.transitionProperties};

  &:hover,
  &:focus {
    color: ${props => props.theme.color('neutral.200')};
    background-color: ${props => props.theme.color('black')};
  }
`;

const Link = styled(Space).attrs({
  as: 'a',
})`
  display: flex;
  padding: 6px;
`;

type SocialItem = {
  url: string;
  title: string;
  service: string;
  icon: IconSvg;
};

const items: SocialItem[] = [
  {
    url: 'https://x.com/explorewellcome',
    title: 'X',
    service: 'X',
    icon: xSocial,
  },
  {
    url: 'https://www.facebook.com/wellcomecollection/',
    title: 'Facebook',
    service: 'Facebook',
    icon: facebook,
  },
  {
    url: 'https://www.instagram.com/wellcomecollection/',
    title: 'Instagram',
    service: 'Instagram',
    icon: instagram,
  },
  {
    url: 'https://www.youtube.com/user/WellcomeCollection',
    title: 'YouTube',
    service: 'YouTube',
    icon: youtube,
  },
];

const FooterSocial: FunctionComponent = () => {
  return (
    <>
      {items.map(item => (
        <Cell key={item.title}>
          <Link href={item.url}>
            <Icon icon={item.icon} />
            <span className="visually-hidden">{item.service}</span>
          </Link>
        </Cell>
      ))}
    </>
  );
};

export default FooterSocial;
