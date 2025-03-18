import { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  facebook,
  IconSvg,
  instagram,
  soundCloud,
  tripadvisor,
  twitter,
  youtube,
} from '@weco/common/icons';
import { useToggles } from '@weco/common/server-data/Context';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

const Cell = styled(Space).attrs({
  $h: { size: 'm', properties: ['margin-right'] },
})<{ $exhibitionAccessContent?: boolean }>`
  background-color: ${props => props.theme.color('neutral.200')};
  color: ${props => props.theme.color('black')};
  border-radius: 50%;
  transition: all ${props => props.theme.transitionProperties};

  &:hover,
  &:focus {
    color: ${props => props.theme.color('neutral.200')};
    background-color: ${props => props.theme.color('black')};
  }

  ${props =>
    props.$exhibitionAccessContent &&
    props.theme.mediaBetween(
      'small',
      'large'
    )(`
    margin-right: 0;
  `)}
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
    icon: soundCloud,
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

const FooterSocial: FunctionComponent = () => {
  const { exhibitionAccessContent } = useToggles();
  return (
    <>
      {items.map(item => (
        <Cell
          $exhibitionAccessContent={exhibitionAccessContent}
          key={item.title}
        >
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
