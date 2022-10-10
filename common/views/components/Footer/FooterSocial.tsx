import { FC } from 'react';
import styled from 'styled-components';
import {
  facebook,
  instagram,
  soundcloud,
  tripadvisor,
  twitter,
  youtube,
  IconSvg,
} from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

const Cell = styled(Space).attrs({
  h: { size: 'm', properties: ['margin-right'] },
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

type LinkProps = {
  href: string;
};

const Link = styled(Space).attrs({
  as: 'a',
})<LinkProps>`
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
    url: 'https://twitter.com/explorewellcome',
    title: 'Twitter',
    service: 'Twitter',
    icon: twitter,
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
    url: 'https://soundcloud.com/wellcomecollection',
    title: 'SoundCloud',
    service: 'SoundCloud',
    icon: soundcloud,
  },
  {
    url: 'https://www.youtube.com/user/WellcomeCollection',
    title: 'YouTube',
    service: 'YouTube',
    icon: youtube,
  },
  {
    url: 'https://www.tripadvisor.co.uk/Attraction_Review-g186338-d662065-Reviews-Wellcome_Collection-London_England.html',
    title: 'Tripadvisor',
    service: 'Tripadvisor',
    icon: tripadvisor,
  },
];

const FooterSocial: FC = () => (
  <>
    {items.map(item => (
      <Cell key={item.title}>
        <Link href={item.url}>
          <Icon icon={item.icon} color="currentColor" />
          <span className="visually-hidden">{item.service}</span>
        </Link>
      </Cell>
    ))}
  </>
);

export default FooterSocial;
